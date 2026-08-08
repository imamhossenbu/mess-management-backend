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
import { startOfDay, endOfDay, format, getMonth, getYear } from "date-fns";
import { NotificationsService } from "../notifications/notifications.service"; // ✅ Import

@Injectable()
export class MealsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService, // ✅ Inject
  ) {}

  // ==================== CREATE ====================

  async create(createMealDto: CreateMealDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createMealDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createMealDto.userId} not found`,
      );
    }

    // Check if already exists for this date
    const date = createMealDto.date ? new Date(createMealDto.date) : new Date();
    const start = startOfDay(date);
    const end = endOfDay(date);

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

    // Calculate total meal
    const morning = createMealDto.morning || false;
    const lunch = createMealDto.lunch || false;
    const dinner = createMealDto.dinner || false;
    const totalMeal = (morning ? 1 : 0) + (lunch ? 1 : 0) + (dinner ? 1 : 0);

    const meal = await this.prisma.meal.create({
      data: {
        userId: createMealDto.userId,
        date: date,
        morning,
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

    // ✅ Send notification to user about meal entry
    const mealType = [];
    if (morning) mealType.push("Morning");
    if (lunch) mealType.push("Lunch");
    if (dinner) mealType.push("Dinner");

    await this.notificationsService.create({
      userId: createMealDto.userId,
      type: "MEAL",
      title: "Meal Entry Added",
      message: `Your meal entry for ${format(date, "yyyy-MM-dd")} has been added (${mealType.join(", ")}). Total: ${totalMeal} meal(s)`,
      link: "/meals",
    });

    return meal;
  }

  // ==================== BULK ENTRY ====================

  async bulkEntry(bulkMealDto: BulkMealEntryDto) {
    const date = new Date(bulkMealDto.date);
    const start = startOfDay(date);
    const end = endOfDay(date);

    // Delete existing meals for this date
    await this.prisma.meal.deleteMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const allUserIds = [
      ...(bulkMealDto.morningUserIds || []),
      ...(bulkMealDto.lunchUserIds || []),
      ...(bulkMealDto.dinnerUserIds || []),
    ];

    // Get unique user IDs
    const uniqueUserIds = [...new Set(allUserIds)];

    // Check if all users exist
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: uniqueUserIds },
      },
      select: { id: true },
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

    // Create meals for all users
    const morningSet = new Set(bulkMealDto.morningUserIds || []);
    const lunchSet = new Set(bulkMealDto.lunchUserIds || []);
    const dinnerSet = new Set(bulkMealDto.dinnerUserIds || []);

    const mealPromises = uniqueUserIds.map(async (userId) => {
      const morning = morningSet.has(userId);
      const lunch = lunchSet.has(userId);
      const dinner = dinnerSet.has(userId);
      const totalMeal = (morning ? 1 : 0) + (lunch ? 1 : 0) + (dinner ? 1 : 0);

      return this.prisma.meal.create({
        data: {
          userId,
          date: date,
          morning,
          lunch,
          dinner,
          totalMeal,
        },
      });
    });

    const meals = await Promise.all(mealPromises);

    // Update daily summary
    await this.updateDailySummary(date);

    // Fetch user details
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

    // ✅ Send bulk notification to all users
    for (const userId of uniqueUserIds) {
      const morning = morningSet.has(userId);
      const lunch = lunchSet.has(userId);
      const dinner = dinnerSet.has(userId);
      const mealType = [];
      if (morning) mealType.push("Morning");
      if (lunch) mealType.push("Lunch");
      if (dinner) mealType.push("Dinner");
      const totalMeal = (morning ? 1 : 0) + (lunch ? 1 : 0) + (dinner ? 1 : 0);

      await this.notificationsService.create({
        userId,
        type: "MEAL",
        title: "Meal Entry Added",
        message: `Your meal entry for ${format(date, "yyyy-MM-dd")} has been added (${mealType.join(", ")}). Total: ${totalMeal} meal(s)`,
        link: "/meals",
      });
    }

    // ✅ Send notification to admins about bulk entry
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "MANAGER"] },
        isActive: true,
      },
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
        totalMorning: mealsWithUsers.filter((m) => m.morning).length,
        totalLunch: mealsWithUsers.filter((m) => m.lunch).length,
        totalDinner: mealsWithUsers.filter((m) => m.dinner).length,
        totalMeals: mealsWithUsers.reduce((sum, m) => sum + m.totalMeal, 0),
      },
      meals: mealsWithUsers,
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
      },
      select: { id: true },
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
        // Update existing
        const updateData: any = {};
        updateData[mealType] = true;

        // Recalculate total
        const morning = mealType === "morning" ? true : existing.morning;
        const lunch = mealType === "lunch" ? true : existing.lunch;
        const dinner = mealType === "dinner" ? true : existing.dinner;
        const totalMeal =
          (morning ? 1 : 0) + (lunch ? 1 : 0) + (dinner ? 1 : 0);

        return this.prisma.meal.update({
          where: { id: existing.id },
          data: {
            ...updateData,
            totalMeal,
          },
        });
      } else {
        // Create new
        const morning = mealType === "morning";
        const lunch = mealType === "lunch";
        const dinner = mealType === "dinner";
        const totalMeal =
          (morning ? 1 : 0) + (lunch ? 1 : 0) + (dinner ? 1 : 0);

        return this.prisma.meal.create({
          data: {
            userId,
            date: date,
            morning,
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

    // ✅ Send notifications
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
        totalMorning: updatedMeals.filter((m) => m.morning).length,
        totalLunch: updatedMeals.filter((m) => m.lunch).length,
        totalDinner: updatedMeals.filter((m) => m.dinner).length,
        totalMeals: updatedMeals.reduce((sum, m) => sum + m.totalMeal, 0),
      },
      meals: updatedMeals,
    };
  }

  // ==================== FIND ====================

  async findAll() {
    return this.prisma.meal.findMany({
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
  }

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

    return meal;
  }

  async findByUser(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      };
    }

    return this.prisma.meal.findMany({
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
  }

  async findByDate(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    return this.prisma.meal.findMany({
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
  }

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

    const totalMorning = meals.filter((m) => m.morning).length;
    const totalLunch = meals.filter((m) => m.lunch).length;
    const totalDinner = meals.filter((m) => m.dinner).length;
    const totalMeals = meals.reduce((sum, m) => sum + m.totalMeal, 0);

    // Get daily summary from database
    const dailySummary = await this.prisma.dailySummary.findUnique({
      where: {
        date: start,
      },
    });

    return {
      date: format(date, "yyyy-MM-dd"),
      totalMorning,
      totalLunch,
      totalDinner,
      totalMeals,
      totalUsers: meals.length,
      mealRate: dailySummary?.mealRate ? Number(dailySummary.mealRate) : 0,
      runningMarketCost: dailySummary?.runningMarketCost
        ? Number(dailySummary.runningMarketCost)
        : 0,
      runningTotalMeal: dailySummary?.runningTotalMeal || 0,
      meals,
    };
  }

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

    // User-wise summary
    const userMap = new Map<
      string,
      {
        userId: string;
        userName: string;
        morning: number;
        lunch: number;
        dinner: number;
        totalMeals: number;
      }
    >();

    meals.forEach((meal) => {
      const existing = userMap.get(meal.userId);
      if (existing) {
        existing.morning += meal.morning ? 1 : 0;
        existing.lunch += meal.lunch ? 1 : 0;
        existing.dinner += meal.dinner ? 1 : 0;
        existing.totalMeals += meal.totalMeal;
      } else {
        userMap.set(meal.userId, {
          userId: meal.userId,
          userName: meal.user.name,
          morning: meal.morning ? 1 : 0,
          lunch: meal.lunch ? 1 : 0,
          dinner: meal.dinner ? 1 : 0,
          totalMeals: meal.totalMeal,
        });
      }
    });

    const totalMorning = meals.filter((m) => m.morning).length;
    const totalLunch = meals.filter((m) => m.lunch).length;
    const totalDinner = meals.filter((m) => m.dinner).length;
    const totalMeals = meals.reduce((sum, m) => sum + m.totalMeal, 0);

    return {
      month: format(new Date(year, month - 1, 1), "MMMM"),
      year,
      totalMorning,
      totalLunch,
      totalDinner,
      totalMeals,
      totalUsers: userMap.size,
      userSummaries: Array.from(userMap.values()).sort(
        (a, b) => b.totalMeals - a.totalMeals,
      ),
    };
  }

  // ==================== UPDATE ====================

  async update(id: string, updateMealDto: UpdateMealDto) {
    const existing = await this.prisma.meal.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    const morning =
      updateMealDto.morning !== undefined
        ? updateMealDto.morning
        : existing.morning;
    const lunch =
      updateMealDto.lunch !== undefined ? updateMealDto.lunch : existing.lunch;
    const dinner =
      updateMealDto.dinner !== undefined
        ? updateMealDto.dinner
        : existing.dinner;
    const totalMeal = (morning ? 1 : 0) + (lunch ? 1 : 0) + (dinner ? 1 : 0);

    const meal = await this.prisma.meal.update({
      where: { id },
      data: {
        morning,
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
    await this.updateDailySummary(meal.date);

    // ✅ Send notification for update
    const mealType = [];
    if (morning) mealType.push("Morning");
    if (lunch) mealType.push("Lunch");
    if (dinner) mealType.push("Dinner");

    await this.notificationsService.create({
      userId: existing.userId,
      type: "MEAL",
      title: "Meal Entry Updated",
      message: `Your meal entry for ${format(meal.date, "yyyy-MM-dd")} has been updated. New: ${mealType.join(", ")}. Total: ${totalMeal} meal(s)`,
      link: "/meals",
    });

    return meal;
  }

  // ==================== DELETE ====================

  async remove(id: string) {
    const meal = await this.prisma.meal.findUnique({
      where: { id },
    });

    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    await this.prisma.meal.delete({
      where: { id },
    });

    // Update daily summary
    await this.updateDailySummary(meal.date);

    // ✅ Send notification for deletion
    await this.notificationsService.create({
      userId: meal.userId,
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

    // Update daily summary
    await this.updateDailySummary(date);

    // ✅ Send notification for bulk deletion
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "MANAGER"] },
        isActive: true,
      },
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

    // Get today's meals
    const meals = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const dailyTotalMeal = meals.reduce((sum, m) => sum + m.totalMeal, 0);

    // Get previous day's summary
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    const previousStart = startOfDay(previousDay);

    const previousSummary = await this.prisma.dailySummary.findUnique({
      where: {
        date: previousStart,
      },
    });

    const previousRunningCost =
      previousSummary?.runningMarketCost ||
      (new PrismaService().$queryRaw`0` as any);
    // Actually we need to get from marketing - will be updated when marketing module is added

    // For now, just update meal data
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
