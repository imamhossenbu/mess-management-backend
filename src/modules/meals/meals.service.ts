// src/modules/meals/meals.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CreateMealDto,
  BulkMealEntryDto,
  SingleMealEntryDto,
  UpdateMealDto,
} from "./dto";
import { startOfDay, endOfDay, format, eachDayOfInterval } from "date-fns";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class MealsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ==================== CREATE ====================

  async create(createMealDto: CreateMealDto) {
    // Check if user exists and is active
    const user = await this.prisma.user.findUnique({
      where: { id: createMealDto.userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(`User not found or inactive`);
    }

    const date = createMealDto.date ? new Date(createMealDto.date) : new Date();
    const start = startOfDay(date);
    const end = endOfDay(date);

    // Check if meal already exists for this date
    const existing = await this.prisma.meal.findFirst({
      where: {
        userId: createMealDto.userId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Meal already exists for user on ${format(date, "yyyy-MM-dd")}`,
      );
    }

    const lunch = createMealDto.lunch || false;
    const dinner = createMealDto.dinner || false;
    const totalMeal = (lunch ? 1 : 0) + (dinner ? 1 : 0);

    const meal = await this.prisma.meal.create({
      data: {
        userId: createMealDto.userId,
        date: date,
        lunch,
        dinner,
        totalMeal,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    // Update daily summary
    await this.updateDailySummary(date);

    // Send notification
    const mealType = [];
    if (lunch) mealType.push("Lunch");
    if (dinner) mealType.push("Dinner");

    await this.notificationsService.create({
      userId: createMealDto.userId,
      type: "MEAL",
      title: "Meal Entry Added",
      message: `Your meal entry for ${format(date, "yyyy-MM-dd")} has been added (${mealType.join(", ")}). Total: ${totalMeal} meal(s)`,
      link: "/meals",
    });

    return {
      ...meal,
      userName: meal.user?.name || "Unknown",
    };
  }

  // ==================== BULK ENTRY ====================

  async bulkEntry(bulkMealDto: BulkMealEntryDto) {
    const date = new Date(bulkMealDto.date);
    const start = startOfDay(date);
    const end = endOfDay(date);

    const allUserIds = [
      ...(bulkMealDto.lunchUserIds || []),
      ...(bulkMealDto.dinnerUserIds || []),
    ];

    const uniqueUserIds = [...new Set(allUserIds)];

    // Check if all users exist and are active
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: uniqueUserIds },
        isActive: true,
      },
    });

    const foundUserIds = users.map((u) => u.id);
    const missingUserIds = uniqueUserIds.filter(
      (id) => !foundUserIds.includes(id),
    );

    if (missingUserIds.length > 0) {
      throw new NotFoundException(
        `Users not found: ${missingUserIds.join(", ")}`,
      );
    }

    // Delete existing meals for this date
    await this.prisma.meal.deleteMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const lunchSet = new Set(bulkMealDto.lunchUserIds || []);
    const dinnerSet = new Set(bulkMealDto.dinnerUserIds || []);

    const mealPromises = uniqueUserIds.map(async (userId) => {
      const lunch = lunchSet.has(userId);
      const dinner = dinnerSet.has(userId);
      const totalMeal = (lunch ? 1 : 0) + (dinner ? 1 : 0);

      return this.prisma.meal.create({
        data: {
          userId,
          date: date,
          lunch,
          dinner,
          totalMeal,
        },
      });
    });

    const meals = await Promise.all(mealPromises);

    // Update daily summary
    await this.updateDailySummary(date);

    // Fetch meals with user details
    const mealsWithUsers = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    // Send notifications to all users
    for (const userId of uniqueUserIds) {
      const lunch = lunchSet.has(userId);
      const dinner = dinnerSet.has(userId);
      const mealType = [];
      if (lunch) mealType.push("Lunch");
      if (dinner) mealType.push("Dinner");
      const totalMeal = (lunch ? 1 : 0) + (dinner ? 1 : 0);

      await this.notificationsService.create({
        userId,
        type: "MEAL",
        title: "Meal Entry Added",
        message: `Your meal entry for ${format(date, "yyyy-MM-dd")} has been added (${mealType.join(", ")}). Total: ${totalMeal} meal(s)`,
        link: "/meals",
      });
    }

    // Send notification to admins
    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "MEAL",
        title: "Bulk Meal Entry",
        message: `Bulk meal entry completed for ${format(date, "yyyy-MM-dd")}. Total: ${uniqueUserIds.length} users, ${mealsWithUsers.reduce((sum, m) => sum + m.totalMeal, 0)} meals`,
        link: "/meals",
      });
    }

    return {
      date: format(date, "yyyy-MM-dd"),
      totalUsers: mealsWithUsers.length,
      summary: {
        totalLunch: mealsWithUsers.filter((m) => m.lunch).length,
        totalDinner: mealsWithUsers.filter((m) => m.dinner).length,
        totalMeals: mealsWithUsers.reduce((sum, m) => sum + m.totalMeal, 0),
      },
      meals: mealsWithUsers.map((m) => ({
        ...m,
        userName: m.user?.name || "Unknown",
      })),
    };
  }

  // ==================== SINGLE MEAL TYPE ENTRY ====================

  async singleMealEntry(singleMealDto: SingleMealEntryDto) {
    const date = new Date(singleMealDto.date);
    const start = startOfDay(date);
    const end = endOfDay(date);
    const mealType = singleMealDto.mealType;

    // Check if all users exist
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: singleMealDto.userIds },
        isActive: true,
      },
    });

    const foundUserIds = users.map((u) => u.id);
    const missingUserIds = singleMealDto.userIds.filter(
      (id) => !foundUserIds.includes(id),
    );

    if (missingUserIds.length > 0) {
      throw new NotFoundException(
        `Users not found: ${missingUserIds.join(", ")}`,
      );
    }

    // Get existing meals for this date
    const existingMeals = await this.prisma.meal.findMany({
      where: {
        userId: { in: singleMealDto.userIds },
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const existingMap = new Map(existingMeals.map((m) => [m.userId, m]));

    // Update or create meals
    const mealPromises = singleMealDto.userIds.map(async (userId) => {
      const existing = existingMap.get(userId);

      if (existing) {
        const lunch = mealType === "lunch" ? true : existing.lunch;
        const dinner = mealType === "dinner" ? true : existing.dinner;
        const totalMeal = (lunch ? 1 : 0) + (dinner ? 1 : 0);

        return this.prisma.meal.update({
          where: { id: existing.id },
          data: {
            lunch,
            dinner,
            totalMeal,
          },
        });
      } else {
        const lunch = mealType === "lunch";
        const dinner = mealType === "dinner";
        const totalMeal = (lunch ? 1 : 0) + (dinner ? 1 : 0);

        return this.prisma.meal.create({
          data: {
            userId,
            date: date,
            lunch,
            dinner,
            totalMeal,
          },
        });
      }
    });

    await Promise.all(mealPromises);

    // Update daily summary
    await this.updateDailySummary(date);

    // Fetch updated meals
    const updatedMeals = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    // Send notifications
    for (const userId of singleMealDto.userIds) {
      await this.notificationsService.create({
        userId,
        type: "MEAL",
        title: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Meal Updated`,
        message: `Your ${mealType} meal for ${format(date, "yyyy-MM-dd")} has been recorded.`,
        link: "/meals",
      });
    }

    return {
      date: format(date, "yyyy-MM-dd"),
      mealType,
      totalUsers: updatedMeals.length,
      summary: {
        totalLunch: updatedMeals.filter((m) => m.lunch).length,
        totalDinner: updatedMeals.filter((m) => m.dinner).length,
        totalMeals: updatedMeals.reduce((sum, m) => sum + m.totalMeal, 0),
      },
      meals: updatedMeals.map((m) => ({
        ...m,
        userName: m.user?.name || "Unknown",
      })),
    };
  }

  // ==================== FIND ALL ====================

  async findAll() {
    const meals = await this.prisma.meal.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return meals.map((m) => ({
      ...m,
      userName: m.user?.name || "Unknown",
    }));
  }

  // ==================== FIND ONE ====================

  async findOne(id: string) {
    const meal = await this.prisma.meal.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    return {
      ...meal,
      userName: meal.user?.name || "Unknown",
    };
  }

  // ==================== FIND BY USER ====================

  async findByUser(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      };
    }

    const meals = await this.prisma.meal.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return meals.map((m) => ({
      ...m,
      userName: m.user?.name || "Unknown",
    }));
  }

  // ==================== FIND BY DATE ====================

  async findByDate(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const meals = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    });

    return meals.map((m) => ({
      ...m,
      userName: m.user?.name || "Unknown",
    }));
  }

  // ==================== DAILY SUMMARY ====================

  async getDailySummary(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const meals = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    });

    const totalLunch = meals.filter((m) => m.lunch).length;
    const totalDinner = meals.filter((m) => m.dinner).length;
    const totalMeals = meals.reduce((sum, m) => sum + m.totalMeal, 0);

    const dailySummary = await this.prisma.dailySummary.findUnique({
      where: {
        date: start,
      },
    });

    return {
      date: format(date, "yyyy-MM-dd"),
      totalLunch,
      totalDinner,
      totalMeals,
      totalUsers: meals.length,
      mealRate: dailySummary?.mealRate ? Number(dailySummary.mealRate) : 0,
      runningMarketCost: dailySummary?.runningMarketCost
        ? Number(dailySummary.runningMarketCost)
        : 0,
      runningTotalMeal: dailySummary?.runningTotalMeal || 0,
      meals: meals.map((m) => ({
        ...m,
        userName: m.user?.name || "Unknown",
      })),
    };
  }

  // ==================== MONTHLY SUMMARY ====================

  async getMonthlySummary(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const meals = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const userMap = new Map<
      string,
      {
        userId: string;
        userName: string;
        lunch: number;
        dinner: number;
        totalMeals: number;
      }
    >();

    meals.forEach((meal) => {
      const userId = meal.userId;
      const existing = userMap.get(userId);
      if (existing) {
        existing.lunch += meal.lunch ? 1 : 0;
        existing.dinner += meal.dinner ? 1 : 0;
        existing.totalMeals += meal.totalMeal;
      } else {
        userMap.set(userId, {
          userId: userId,
          userName: meal.user.name,
          lunch: meal.lunch ? 1 : 0,
          dinner: meal.dinner ? 1 : 0,
          totalMeals: meal.totalMeal,
        });
      }
    });

    const totalLunch = meals.filter((m) => m.lunch).length;
    const totalDinner = meals.filter((m) => m.dinner).length;
    const totalMeals = meals.reduce((sum, m) => sum + m.totalMeal, 0);

    return {
      month: format(startDate, "MMMM"),
      year,
      totalLunch,
      totalDinner,
      totalMeals,
      totalUsers: userMap.size,
      userSummaries: Array.from(userMap.values()).sort(
        (a, b) => b.totalMeals - a.totalMeals,
      ),
    };
  }

  // ==================== MONTHLY DATE WISE MEAL VIEW ====================

  async getMonthlyDateWiseMeals(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get all days of the month
    const days = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    // Get all meals for the month
    const meals = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ date: "asc" }, { user: { name: "asc" } }],
    });

    // Group meals by date
    const mealsByDate = new Map();
    meals.forEach((meal) => {
      const dateKey = format(meal.date, "yyyy-MM-dd");
      if (!mealsByDate.has(dateKey)) {
        mealsByDate.set(dateKey, []);
      }
      mealsByDate.get(dateKey).push({
        userId: meal.userId,
        userName: meal.user.name,
        lunch: meal.lunch,
        dinner: meal.dinner,
        totalMeal: meal.totalMeal,
      });
    });

    // Get all active users for the month
    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Create daily summary with user-wise meal data
    const dailyData = days.map((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      const dayMeals = mealsByDate.get(dateKey) || [];

      // Create user-wise meal status for this day
      const userMeals = users.map((user) => {
        const userMeal = dayMeals.find((m) => m.userId === user.id);
        return {
          userId: user.id,
          userName: user.name,
          morning: userMeal?.morning || false,
          lunch: userMeal?.lunch || false,
          dinner: userMeal?.dinner || false,
          totalMeal: userMeal?.totalMeal || 0,
        };
      });

      const totalMorning = dayMeals.filter((m) => m.morning).length;
      const totalLunch = dayMeals.filter((m) => m.lunch).length;
      const totalDinner = dayMeals.filter((m) => m.dinner).length;
      const totalMeals = dayMeals.reduce((sum, m) => sum + m.totalMeal, 0);

      return {
        date: dateKey,
        dayOfWeek: format(day, "EEEE"),
        totalMorning,
        totalLunch,
        totalDinner,
        totalMeals,
        totalUsers: dayMeals.length,
        userMeals,
      };
    });

    // Calculate monthly totals
    const monthlyTotals = {
      totalMorning: dailyData.reduce((sum, d) => sum + d.totalMorning, 0),
      totalLunch: dailyData.reduce((sum, d) => sum + d.totalLunch, 0),
      totalDinner: dailyData.reduce((sum, d) => sum + d.totalDinner, 0),
      totalMeals: dailyData.reduce((sum, d) => sum + d.totalMeals, 0),
    };

    // Calculate user-wise monthly totals
    const userMonthlyTotals = users.map((user) => {
      let morning = 0,
        lunch = 0,
        dinner = 0,
        total = 0;
      dailyData.forEach((day) => {
        const userMeal = day.userMeals.find((m) => m.userId === user.id);
        if (userMeal) {
          morning += userMeal.morning ? 1 : 0;
          lunch += userMeal.lunch ? 1 : 0;
          dinner += userMeal.dinner ? 1 : 0;
          total += userMeal.totalMeal;
        }
      });
      return {
        userId: user.id,
        userName: user.name,
        morning,
        lunch,
        dinner,
        totalMeals: total,
      };
    });

    return {
      month: format(startDate, "MMMM"),
      year,
      totalDays: days.length,
      monthlyTotals,
      userMonthlyTotals: userMonthlyTotals.sort(
        (a, b) => b.totalMeals - a.totalMeals,
      ),
      dailyData,
    };
  }

  // ==================== UPDATE ====================

  async update(id: string, updateMealDto: UpdateMealDto) {
    const existing = await this.prisma.meal.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    const lunch =
      updateMealDto.lunch !== undefined ? updateMealDto.lunch : existing.lunch;
    const dinner =
      updateMealDto.dinner !== undefined
        ? updateMealDto.dinner
        : existing.dinner;
    const totalMeal = (lunch ? 1 : 0) + (dinner ? 1 : 0);

    const meal = await this.prisma.meal.update({
      where: { id },
      data: {
        lunch,
        dinner,
        totalMeal,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    await this.updateDailySummary(meal.date);

    const mealType = [];
    if (lunch) mealType.push("Lunch");
    if (dinner) mealType.push("Dinner");

    await this.notificationsService.create({
      userId: existing.userId,
      type: "MEAL",
      title: "Meal Entry Updated",
      message: `Your meal entry for ${format(meal.date, "yyyy-MM-dd")} has been updated. New: ${mealType.join(", ")}. Total: ${totalMeal} meal(s)`,
      link: "/meals",
    });

    return {
      ...meal,
      userName: meal.user?.name || "Unknown",
    };
  }

  // ==================== DELETE ====================

  async remove(id: string) {
    const meal = await this.prisma.meal.findUnique({
      where: { id },
    });

    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    const userId = meal.userId;

    await this.prisma.meal.delete({
      where: { id },
    });

    await this.updateDailySummary(meal.date);

    await this.notificationsService.create({
      userId,
      type: "MEAL",
      title: "Meal Entry Deleted",
      message: `Your meal entry for ${format(meal.date, "yyyy-MM-dd")} has been deleted.`,
      link: "/meals",
    });

    return { message: `Meal with ID ${id} deleted successfully` };
  }

  async removeByDate(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const deleted = await this.prisma.meal.deleteMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    await this.updateDailySummary(date);

    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "MEAL",
        title: "Bulk Meal Deletion",
        message: `${deleted.count} meal entries deleted for ${format(date, "yyyy-MM-dd")}`,
        link: "/meals",
      });
    }

    return {
      message: `Deleted ${deleted.count} meals for ${format(date, "yyyy-MM-dd")}`,
      count: deleted.count,
    };
  }

  // ==================== DAILY SUMMARY UPDATE ====================

  private async updateDailySummary(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const meals = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const dailyTotalMeal = meals.reduce((sum, m) => sum + m.totalMeal, 0);

    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    const previousStart = startOfDay(previousDay);

    const previousSummary = await this.prisma.dailySummary.findUnique({
      where: {
        date: previousStart,
      },
    });

    const existing = await this.prisma.dailySummary.findUnique({
      where: {
        date: start,
      },
    });

    if (existing) {
      await this.prisma.dailySummary.update({
        where: { date: start },
        data: {
          dailyTotalMeal,
        },
      });
    } else {
      await this.prisma.dailySummary.create({
        data: {
          date: start,
          dailyTotalMeal,
          dailyMarketCost: 0,
          runningMarketCost: 0,
          runningTotalMeal: 0,
          mealRate: 0,
        },
      });
    }
  }
}
