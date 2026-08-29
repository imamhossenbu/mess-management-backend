// src/modules/monthly-summary/monthly-summary.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  startOfDay,
  endOfDay,
  format,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { UserMonthlySummaryDto, MonthlySummaryResponseDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class MonthlySummaryService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) { }

  // ==================== GENERATE MONTHLY SUMMARY ====================

  async generateMonthlySummary(year: number, month: number, adjustmentFromPrevious: number, adjustmentToNext: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // 1. Get all active users
    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
      },
      include: {
        userBalance: true,
      },
    });

    if (users.length === 0) {
      throw new BadRequestException("No active users found");
    }

    // 2. Get meals for this month
    const meals = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      include: {
        user: true,
      },
    });

    // 3. Get marketing costs for this month
    const marketings = await this.prisma.marketing.findMany({
      where: {
        date: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      include: {
        items: true,
      },
    });

    const totalMarketCost = marketings.reduce(
      (sum, m) => sum + Number(m.totalAmount),
      0,
    );

    // 4. Get utility bills for this month
    const utilityBills = await this.prisma.utilityBill.findMany({
      where: {
        monthYear: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
    });

    const totalUtilityCost = utilityBills.reduce(
      (sum, b) => sum + Number(b.amount),
      0,
    );

    // 4.5. Get Shop Debts (Credit Purchases) for this month
    const shopDebts = await this.prisma.shopDebt.findMany({
      where: {
        date: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
    });

    const totalShopDebtCost = shopDebts.reduce(
      (sum, d) => sum + Number(d.amount),
      0,
    );

    // 5. Calculate total meals per user
    const userMealMap = new Map<
      string,
      { totalMeal: number; lunch: number; dinner: number }
    >();

    meals.forEach((meal) => {
      const existing = userMealMap.get(meal.userId);
      if (existing) {
        existing.totalMeal += meal.totalMeal;
        existing.lunch += meal.lunch ? 1 : 0;
        existing.dinner += meal.dinner ? 1 : 0;
      } else {
        userMealMap.set(meal.userId, {
          totalMeal: meal.totalMeal,
          lunch: meal.lunch ? 1 : 0,
          dinner: meal.dinner ? 1 : 0,
        });
      }
    });

    // 6. Calculate total meals
    const totalMeals = Array.from(userMealMap.values()).reduce(
      (sum, u) => sum + u.totalMeal,
      0,
    );

    // 7. Calculate total mess expense and meal rate
    const adjPrev = Number(adjustmentFromPrevious) || 0;
    const adjNext = Number(adjustmentToNext) || 0;
    const netMarketCost = totalMarketCost + totalShopDebtCost + adjPrev - adjNext;
    
    const mealRate = totalMeals > 0 ? netMarketCost / totalMeals : 0;
    const perPersonUtility = totalUtilityCost / users.length;

    // 9. Get payments for this month
    const payments = await this.prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
    });

    const userPaymentMap = new Map<string, number>();
    payments.forEach((payment) => {
      const existing = userPaymentMap.get(payment.userId) || 0;
      userPaymentMap.set(payment.userId, existing + Number(payment.amount));
    });

    // 10. Get previous month's due
    // DISABLED as per user request: balances do not carry over to the next month's calculation automatically.
    const previousDueMap = new Map<string, number>();

    // 11. Generate user summaries
    const userSummaries: UserMonthlySummaryDto[] = users.map((user) => {
      const userMeal = userMealMap.get(user.id) || {
        totalMeal: 0,
        morning: 0,
        lunch: 0,
        dinner: 0,
      };
      const mealBill = userMeal.totalMeal * mealRate;
      const utilityShare = perPersonUtility;
      const totalBill = mealBill + utilityShare;
      const totalPaid = userPaymentMap.get(user.id) || 0;
      const previousDue = 0;
      const currentDue = totalBill - totalPaid;

      return {
        userId: user.id,
        userName: user.name,
        phone: user.phone || "",
        totalMeal: userMeal.totalMeal,
        mealRate: Number(mealRate),
        mealBill: Number(mealBill),
        utilityShare: Number(utilityShare),
        totalBill: Number(totalBill),
        totalPaid: Number(totalPaid),
        previousDue: Number(previousDue),
        currentDue: Number(currentDue),
        carryToNext: Number(currentDue),
      };
    });

    // 12. Save to database
    await this.saveMonthlySummary(year, month, userSummaries, {
      totalMeals,
      mealRate,
      totalMarketCost: netMarketCost,
      totalUtilityCost,
      adjustmentFromPrevious: adjPrev,
      adjustmentToNext: adjNext,
    });

    // Send notifications
    await this.sendNotifications(year, month, userSummaries);

    return {
      month: format(startDate, "MMMM"),
      year,
      totalMeals,
      mealRate: Number(mealRate),
      totalMealBill: Number(totalMeals * mealRate),
      totalUtilityBill: Number(totalUtilityCost),
      totalBill: Number(totalMeals * mealRate + totalUtilityCost),
      totalPaid: Number(
        Array.from(userPaymentMap.values()).reduce((a, b) => a + b, 0),
      ),
      totalDue: Number(userSummaries.reduce((sum, u) => sum + u.currentDue, 0)),
      userSummaries,
    };
  }

  // ==================== SAVE TO DATABASE ====================

  private async saveMonthlySummary(
    year: number,
    month: number,
    userSummaries: UserMonthlySummaryDto[],
    totals: {
      totalMeals: number;
      mealRate: number;
      totalMarketCost: number;
      totalUtilityCost: number;
      adjustmentFromPrevious: number;
      adjustmentToNext: number;
    },
  ) {
    const monthYear = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Delete existing summary for this month
    await this.prisma.monthlySummary.deleteMany({
      where: {
        monthYear: {
          gte: startOfDay(monthYear),
          lte: endOfDay(endDate),
        },
      },
    });

    // Create new summaries
    for (const summary of userSummaries) {
      await this.prisma.monthlySummary.create({
        data: {
          userId: summary.userId,
          monthYear: monthYear,
          totalMeal: summary.totalMeal,
          mealRate: summary.mealRate,
          mealBill: summary.mealBill,
          utilityShare: summary.utilityShare,
          totalBill: summary.totalBill,
          totalPaid: summary.totalPaid,
          previousDue: summary.previousDue,
          currentDue: summary.currentDue,
          carryToNext: summary.carryToNext,
          adjustmentFromPrevious: totals.adjustmentFromPrevious,
          adjustmentToNext: totals.adjustmentToNext,
        },
      });
    }

    // Update user balances
    for (const summary of userSummaries) {
      const payments = await this.prisma.payment.findMany({
        where: { userId: summary.userId },
      });
      const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

      const summaries = await this.prisma.monthlySummary.findMany({
        where: { userId: summary.userId },
      });
      const totalBilled = summaries.reduce((sum, s) => sum + Number(s.totalBill), 0);

      const newBalance = totalPaid - totalBilled;

      const userBalance = await this.prisma.userBalance.findUnique({
        where: { userId: summary.userId },
      });

      if (userBalance) {
        await this.prisma.userBalance.update({
          where: { userId: summary.userId },
          data: {
            balance: newBalance,
            lastUpdated: new Date(),
          },
        });
      } else {
        await this.prisma.userBalance.create({
          data: {
            userId: summary.userId,
            balance: newBalance,
          },
        });
      }
    }
  }

  // ==================== SEND NOTIFICATIONS ====================

  private async sendNotifications(
    year: number,
    month: number,
    userSummaries: UserMonthlySummaryDto[],
  ) {
    const startDate = new Date(year, month - 1, 1);

    // Send individual bill notifications
    for (const summary of userSummaries) {
      await this.notificationsService.create({
        userId: summary.userId,
        type: "BILL",
        title: `Monthly Bill - ${format(startDate, "MMMM yyyy")}`,
        message: `Your total bill: ${summary.totalBill} TK. Paid: ${summary.totalPaid} TK. Due: ${summary.currentDue} TK`,
        link: `/monthly-summary?year=${year}&month=${month}`,
      });

      if (summary.currentDue > 0) {
        await this.notificationsService.create({
          userId: summary.userId,
          type: "BILL",
          title: "Payment Reminder",
          message: `You have a due balance of ${summary.currentDue} TK for ${format(startDate, "MMMM yyyy")}. Please pay by 15th of next month.`,
          link: "/payments",
        });
      }
    }

    // Send summary notification to admins
    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
    });

    const totalDue = userSummaries.reduce((sum, u) => sum + u.currentDue, 0);
    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "SUMMARY",
        title: `Monthly Summary Generated - ${format(startDate, "MMMM yyyy")}`,
        message: `Monthly summary generated. Total users: ${userSummaries.length}, Total due: ${totalDue} TK`,
        link: `/monthly-summary?year=${year}&month=${month}`,
      });
    }
  }

  // ==================== GET MONTHLY SUMMARY ====================

  async getMonthlySummary(
    year: number,
    month: number,
  ): Promise<MonthlySummaryResponseDto> {
    const monthYear = new Date(year, month - 1, 1);

    const summaries = await this.prisma.monthlySummary.findMany({
      where: {
        monthYear: monthYear,
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

    if (summaries.length === 0) {
      return {
        isGenerated: false,
        month: format(monthYear, "MMMM"),
        year,
        totalMeals: 0,
        mealRate: 0,
        totalMealBill: 0,
        totalUtilityBill: 0,
        totalBill: 0,
        totalPaid: 0,
        totalDue: 0,
        adjustmentFromPrevious: 0,
        adjustmentToNext: 0,
        userSummaries: [],
      };
    }

    const userSummaries: UserMonthlySummaryDto[] = summaries.map((s) => ({
      userId: s.userId,
      userName: s.user.name,
      phone: s.user.phone || "",
      totalMeal: s.totalMeal,
      mealRate: Number(s.mealRate),
      mealBill: Number(s.mealBill),
      utilityShare: Number(s.utilityShare),
      totalBill: Number(s.totalBill),
      totalPaid: Number(s.totalPaid),
      previousDue: Number(s.previousDue),
      currentDue: Number(s.currentDue),
      carryToNext: Number(s.carryToNext),
    }));

    const totalMeals = summaries.reduce((sum, s) => sum + s.totalMeal, 0);
    const totalMealBill = summaries.reduce(
      (sum, s) => sum + Number(s.mealBill),
      0,
    );
    const totalUtilityBill = summaries.reduce(
      (sum, s) => sum + Number(s.utilityShare),
      0,
    );
    const totalBill = summaries.reduce(
      (sum, s) => sum + Number(s.totalBill),
      0,
    );
    const totalPaid = summaries.reduce(
      (sum, s) => sum + Number(s.totalPaid),
      0,
    );
    const totalDue = summaries.reduce(
      (sum, s) => sum + Number(s.currentDue),
      0,
    );

    return {
      isGenerated: true,
      month: format(monthYear, "MMMM"),
      year,
      totalMeals,
      mealRate: summaries.length > 0 ? Number(summaries[0].mealRate) : 0,
      totalMealBill,
      totalUtilityBill,
      totalBill,
      totalPaid,
      totalDue,
      adjustmentFromPrevious: summaries.length > 0 ? Number(summaries[0].adjustmentFromPrevious) : 0,
      adjustmentToNext: summaries.length > 0 ? Number(summaries[0].adjustmentToNext) : 0,
      userSummaries,
    };
  }

  // ==================== GET USER'S MONTHLY SUMMARIES ====================

  async getUserMonthlySummaries(userId: string, year?: number, month?: number) {
    const where: any = { userId };

    if (year && month) {
      const monthYear = new Date(year, month - 1, 1);
      where.monthYear = monthYear;
    }

    const summaries = await this.prisma.monthlySummary.findMany({
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
        monthYear: "desc",
      },
    });

    if (summaries.length === 0) {
      throw new NotFoundException(`No summaries found for user ${userId}`);
    }

    return summaries.map((s) => ({
      ...s,
      mealRate: Number(s.mealRate),
      mealBill: Number(s.mealBill),
      utilityShare: Number(s.utilityShare),
      totalBill: Number(s.totalBill),
      totalPaid: Number(s.totalPaid),
      previousDue: Number(s.previousDue),
      currentDue: Number(s.currentDue),
      carryToNext: Number(s.carryToNext),
    }));
  }

  // ==================== GET ALL MONTHLY SUMMARIES ====================

  async getAllMonthlySummaries() {
    const summaries = await this.prisma.monthlySummary.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: [{ monthYear: "desc" }, { user: { name: "asc" } }],
    });

    return summaries.map((s) => ({
      ...s,
      mealRate: Number(s.mealRate),
      mealBill: Number(s.mealBill),
      utilityShare: Number(s.utilityShare),
      totalBill: Number(s.totalBill),
      totalPaid: Number(s.totalPaid),
      previousDue: Number(s.previousDue),
      currentDue: Number(s.currentDue),
      carryToNext: Number(s.carryToNext),
    }));
  }

  // ==================== UPDATE ====================

  async updateMonthlySummary(id: string, updateDto: any) {
    const existing = await this.prisma.monthlySummary.findUnique({
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
      throw new NotFoundException(`Monthly summary with ID ${id} not found`);
    }

    const updated = await this.prisma.monthlySummary.update({
      where: { id },
      data: {
        totalMeal: updateDto.totalMeal,
        mealRate: updateDto.mealRate,
        mealBill: updateDto.mealBill,
        utilityShare: updateDto.utilityShare,
        totalBill: updateDto.totalBill,
        totalPaid: updateDto.totalPaid,
        previousDue: updateDto.previousDue,
        currentDue: updateDto.currentDue,
        carryToNext: updateDto.carryToNext,
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

    await this.notificationsService.create({
      userId: existing.userId,
      type: "SUMMARY",
      title: "Monthly Summary Updated",
      message: `Your monthly summary for ${format(existing.monthYear, "MMMM yyyy")} has been updated. New total bill: ${Number(updated.totalBill)} TK`,
      link: `/monthly-summary?year=${existing.monthYear.getFullYear()}&month=${existing.monthYear.getMonth() + 1}`,
    });

    if (updateDto.currentDue !== undefined) {
      const payments = await this.prisma.payment.findMany({
        where: { userId: existing.userId },
      });
      const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

      const summaries = await this.prisma.monthlySummary.findMany({
        where: { userId: existing.userId },
      });
      const totalBilled = summaries.reduce((sum, s) => sum + Number(s.totalBill), 0);

      const newBalance = totalPaid - totalBilled;

      await this.prisma.userBalance.update({
        where: { userId: existing.userId },
        data: {
          balance: newBalance,
          lastUpdated: new Date(),
        },
      });
    }

    return {
      ...updated,
      mealRate: Number(updated.mealRate),
      mealBill: Number(updated.mealBill),
      utilityShare: Number(updated.utilityShare),
      totalBill: Number(updated.totalBill),
      totalPaid: Number(updated.totalPaid),
      previousDue: Number(updated.previousDue),
      currentDue: Number(updated.currentDue),
      carryToNext: Number(updated.carryToNext),
    };
  }

  // ==================== DELETE MONTHLY SUMMARY ====================

  async deleteMonthlySummary(year: number, month: number) {
    const monthYear = new Date(year, month - 1, 1);

    const summaries = await this.prisma.monthlySummary.findMany({
      where: {
        monthYear: monthYear,
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

    const deleted = await this.prisma.monthlySummary.deleteMany({
      where: {
        monthYear: monthYear,
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundException(
        `No summary found for ${format(monthYear, "MMMM yyyy")}`,
      );
    }

    for (const summary of summaries) {
      await this.notificationsService.create({
        userId: summary.userId,
        type: "SUMMARY",
        title: "Monthly Summary Deleted",
        message: `Your monthly summary for ${format(monthYear, "MMMM yyyy")} has been deleted. Please contact admin if this was a mistake.`,
        link: "/monthly-summary",
      });
    }

    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "SUMMARY",
        title: "Monthly Summary Deleted",
        message: `${deleted.count} summaries deleted for ${format(monthYear, "MMMM yyyy")}`,
        link: "/monthly-summary",
      });
    }

    return {
      message: `Deleted ${deleted.count} summaries for ${format(monthYear, "MMMM yyyy")}`,
      count: deleted.count,
    };
  }
}
