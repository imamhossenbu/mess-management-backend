// src/modules/dashboard/dashboard.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";
import { DashboardStatsDto, MemberDashboardDto, DailySummaryDto } from "./dto";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  // ==================== ADMIN DASHBOARD ====================

  async getAdminDashboard(): Promise<DashboardStatsDto> {
    const today = new Date();
    const startToday = startOfDay(today);
    const endToday = endOfDay(today);
    const startMonth = startOfMonth(today);
    const endMonth = endOfMonth(today);

    // 1. Total Members
    const totalMembers = await this.prisma.user.count();
    const activeMembers = await this.prisma.user.count({
      where: { isActive: true },
    });

    // 2. Today's Meals
    const todayMeals = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: startToday,
          lte: endToday,
        },
      },
    });

    const totalMealsToday = todayMeals.reduce((sum, m) => sum + m.totalMeal, 0);

    // 3. This Month's Meals
    const monthMeals = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    });

    const totalMealsThisMonth = monthMeals.reduce(
      (sum, m) => sum + m.totalMeal,
      0,
    );

    // 4. This Month's Marketing Cost
    const monthMarketings = await this.prisma.marketing.findMany({
      where: {
        date: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    });

    const totalMarketingCost = monthMarketings.reduce(
      (sum, m) => sum + Number(m.amount),
      0,
    );

    // 5. This Month's Utility Bills
    const monthUtilityBills = await this.prisma.utilityBill.findMany({
      where: {
        monthYear: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    });

    const totalUtilityCost = monthUtilityBills.reduce(
      (sum, b) => sum + Number(b.amount),
      0,
    );

    // 6. This Month's Payments
    const monthPayments = await this.prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    });

    const totalPayments = monthPayments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    // 7. Total Due
    const allBalances = await this.prisma.userBalance.findMany();
    const totalDue = allBalances.reduce((sum, b) => sum + Number(b.balance), 0);

    // 8. Meal Rate
    const dailySummary = await this.prisma.dailySummary.findFirst({
      where: {
        date: {
          gte: startToday,
          lte: endToday,
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    const mealRate = dailySummary?.mealRate || 0;

    // 9. Inventory
    const meatInventory = await this.prisma.inventory.findUnique({
      where: { type: "MEAT" },
    });
    const fishInventory = await this.prisma.inventory.findUnique({
      where: { type: "FISH" },
    });

    // 10. Recent Activities
    const recentMeals = await this.prisma.meal.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const recentMarketings = await this.prisma.marketing.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const recentPayments = await this.prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      totalMembers,
      activeMembers,
      totalMealsToday,
      totalMealsThisMonth,
      totalMarketingCostThisMonth: Number(totalMarketingCost),
      totalUtilityCostThisMonth: Number(totalUtilityCost),
      totalCostThisMonth: Number(totalMarketingCost + totalUtilityCost),
      totalPaymentsThisMonth: Number(totalPayments),
      totalDue: Number(totalDue),
      mealRate: Number(mealRate),
      inventory: {
        meat: meatInventory?.quantity || 0,
        fish: fishInventory?.quantity || 0,
      },
      recentActivities: {
        meals: recentMeals,
        marketings: recentMarketings,
        payments: recentPayments,
      },
    };
  }

  // ==================== MEMBER DASHBOARD ====================

  async getMemberDashboard(userId: string): Promise<MemberDashboardDto> {
    const today = new Date();
    const startMonth = startOfMonth(today);
    const endMonth = endOfMonth(today);

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // 1. This Month's Meals
    const meals = await this.prisma.meal.findMany({
      where: {
        userId,
        date: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    });

    const totalMealThisMonth = meals.reduce((sum, m) => sum + m.totalMeal, 0);

    // 2. Get monthly summary
    const monthlySummary = await this.prisma.monthlySummary.findFirst({
      where: {
        userId,
        monthYear: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    });

    // 3. Get user balance
    const userBalance = await this.prisma.userBalance.findUnique({
      where: { userId },
    });

    // 4. Recent Payments
    const recentPayments = await this.prisma.payment.findMany({
      where: { userId },
      take: 5,
      orderBy: { paymentDate: "desc" },
    });

    return {
      userId: user.id,
      userName: user.name,
      totalMealThisMonth,
      mealBillThisMonth: monthlySummary ? Number(monthlySummary.mealBill) : 0,
      utilityShareThisMonth: monthlySummary
        ? Number(monthlySummary.utilityShare)
        : 0,
      totalBillThisMonth: monthlySummary ? Number(monthlySummary.totalBill) : 0,
      totalPaidThisMonth: monthlySummary ? Number(monthlySummary.totalPaid) : 0,
      currentBalance: userBalance ? Number(userBalance.balance) : 0,
      recentPayments,
    };
  }

  // ==================== DAILY SUMMARY ====================

  async getDailySummary(date?: string): Promise<DailySummaryDto> {
    const queryDate = date ? new Date(date) : new Date();
    const start = startOfDay(queryDate);
    const end = endOfDay(queryDate);

    // Get meals
    const meals = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const totalMeals = meals.reduce((sum, m) => sum + m.totalMeal, 0);
    const totalMorning = meals.filter((m) => m.morning).length;
    const totalLunch = meals.filter((m) => m.lunch).length;
    const totalDinner = meals.filter((m) => m.dinner).length;

    // Get marketing cost
    const marketings = await this.prisma.marketing.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const totalMarketingCost = marketings.reduce(
      (sum, m) => sum + Number(m.amount),
      0,
    );

    // Get meal rate
    const dailySummary = await this.prisma.dailySummary.findUnique({
      where: { date: start },
    });

    return {
      date: format(queryDate, "yyyy-MM-dd"),
      totalMeals,
      totalMorning,
      totalLunch,
      totalDinner,
      totalMarketingCost: Number(totalMarketingCost),
      mealRate: dailySummary ? Number(dailySummary.mealRate) : 0,
    };
  }

  // ==================== MONTHLY SUMMARY FOR DASHBOARD ====================

  async getMonthlySummaryForDashboard(year?: number, month?: number) {
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;
    const startDate = new Date(queryYear, queryMonth - 1, 1);
    const endDate = new Date(queryYear, queryMonth, 0);

    // Get all data for the month
    const [meals, marketings, utilityBills, payments, monthlySummaries] =
      await Promise.all([
        this.prisma.meal.findMany({
          where: {
            date: {
              gte: startOfDay(startDate),
              lte: endOfDay(endDate),
            },
          },
        }),
        this.prisma.marketing.findMany({
          where: {
            date: {
              gte: startOfDay(startDate),
              lte: endOfDay(endDate),
            },
          },
        }),
        this.prisma.utilityBill.findMany({
          where: {
            monthYear: {
              gte: startOfDay(startDate),
              lte: endOfDay(endDate),
            },
          },
        }),
        this.prisma.payment.findMany({
          where: {
            paymentDate: {
              gte: startOfDay(startDate),
              lte: endOfDay(endDate),
            },
          },
        }),
        this.prisma.monthlySummary.findMany({
          where: {
            monthYear: {
              gte: startOfDay(startDate),
              lte: endOfDay(endDate),
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
        }),
      ]);

    const totalMeals = meals.reduce((sum, m) => sum + m.totalMeal, 0);
    const totalMarketingCost = marketings.reduce(
      (sum, m) => sum + Number(m.amount),
      0,
    );
    const totalUtilityCost = utilityBills.reduce(
      (sum, b) => sum + Number(b.amount),
      0,
    );
    const totalPayments = payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    const totalDue = monthlySummaries.reduce(
      (sum, s) => sum + Number(s.currentDue),
      0,
    );

    return {
      month: format(startDate, "MMMM"),
      year: queryYear,
      totalMeals,
      totalMarketingCost: Number(totalMarketingCost),
      totalUtilityCost: Number(totalUtilityCost),
      totalCost: Number(totalMarketingCost + totalUtilityCost),
      totalPayments: Number(totalPayments),
      totalDue: Number(totalDue),
      mealRate: totalMeals > 0 ? Number(totalMarketingCost / totalMeals) : 0,
      userSummaries: monthlySummaries.map((s) => ({
        userId: s.userId,
        userName: s.user.name,
        totalMeal: s.totalMeal,
        totalBill: Number(s.totalBill),
        totalPaid: Number(s.totalPaid),
        currentDue: Number(s.currentDue),
      })),
    };
  }
}
