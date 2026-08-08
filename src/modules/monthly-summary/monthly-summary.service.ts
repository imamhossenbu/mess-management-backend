// src/modules/monthly-summary/monthly-summary.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { startOfDay, endOfDay, format, getMonth, getYear } from "date-fns";
import { UserMonthlySummaryDto, MonthlySummaryResponseDto } from "./dto";

@Injectable()
export class MonthlySummaryService {
  constructor(private prisma: PrismaService) {}

  // ==================== GENERATE MONTHLY SUMMARY ====================

  async generateMonthlySummary(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // 1. Get all active users
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      include: {
        balances: true,
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
    });

    const totalMarketCost = marketings.reduce(
      (sum, m) => sum + Number(m.amount),
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

    // 5. Calculate total meals per user
    const userMealMap = new Map<
      string,
      { totalMeal: number; morning: number; lunch: number; dinner: number }
    >();

    meals.forEach((meal) => {
      const existing = userMealMap.get(meal.userId);
      if (existing) {
        existing.totalMeal += meal.totalMeal;
        existing.morning += meal.morning ? 1 : 0;
        existing.lunch += meal.lunch ? 1 : 0;
        existing.dinner += meal.dinner ? 1 : 0;
      } else {
        userMealMap.set(meal.userId, {
          totalMeal: meal.totalMeal,
          morning: meal.morning ? 1 : 0,
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

    // 7. Calculate meal rate
    const mealRate = totalMeals > 0 ? totalMarketCost / totalMeals : 0;

    // 8. Calculate per person utility share
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
    const previousMonth = new Date(year, month - 2, 1);
    const previousSummaries = await this.prisma.monthlySummary.findMany({
      where: {
        monthYear: previousMonth,
      },
    });

    const previousDueMap = new Map<string, number>();
    previousSummaries.forEach((summary) => {
      previousDueMap.set(summary.userId, Number(summary.currentDue));
    });

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
      const previousDue = previousDueMap.get(user.id) || 0;
      const currentDue = totalBill - totalPaid + previousDue;

      return {
        userId: user.id,
        userName: user.name,
        phone: user.phone,
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
      totalMarketCost,
      totalUtilityCost,
    });

    // 13. Return response
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
    },
  ) {
    const monthYear = new Date(year, month - 1, 1);

    // Delete existing summary for this month
    await this.prisma.monthlySummary.deleteMany({
      where: {
        monthYear: monthYear,
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
        },
      });
    }

    // Update user balances
    for (const summary of userSummaries) {
      const userBalance = await this.prisma.userBalance.findUnique({
        where: { userId: summary.userId },
      });

      if (userBalance) {
        await this.prisma.userBalance.update({
          where: { userId: summary.userId },
          data: {
            balance: summary.currentDue, // + = পাওনা, - = বাকি
            lastUpdated: new Date(),
          },
        });
      }
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
      throw new NotFoundException(
        `No summary found for ${format(monthYear, "MMMM yyyy")}`,
      );
    }

    const userSummaries: UserMonthlySummaryDto[] = summaries.map((s) => ({
      userId: s.userId,
      userName: s.user.name,
      phone: s.user.phone,
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
      month: format(monthYear, "MMMM"),
      year,
      totalMeals,
      mealRate: summaries.length > 0 ? Number(summaries[0].mealRate) : 0,
      totalMealBill,
      totalUtilityBill,
      totalBill,
      totalPaid,
      totalDue,
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

  // ==================== DELETE MONTHLY SUMMARY ====================

  async deleteMonthlySummary(year: number, month: number) {
    const monthYear = new Date(year, month - 1, 1);

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

    return {
      message: `Deleted ${deleted.count} summaries for ${format(monthYear, "MMMM yyyy")}`,
      count: deleted.count,
    };
  }
}
