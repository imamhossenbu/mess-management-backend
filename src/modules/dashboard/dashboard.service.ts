// src/modules/dashboard/dashboard.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  format,
  subDays,
  parseISO,
  isValid,
} from "date-fns";
import {
  DashboardStatsDto,
  MemberDashboardDto,
  DailySummaryDto,
  MonthlySummaryDto,
  ActivityDto,
  MealRateHistoryDto,
  MemberBalanceDto,
  MessStatsDto,
  WeeklySummaryDto,
  InventoryCategoryDto,
  InventoryItemDto,
} from "./dto";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ==================== ADMIN DASHBOARD ====================

  async getAdminDashboard(userId: string, year?: number, month?: number): Promise<DashboardStatsDto> {
    const today = new Date();
    const queryYear = year || today.getFullYear();
    const queryMonth = month || today.getMonth() + 1;
    
    const startToday = startOfDay(today);
    const endToday = endOfDay(today);
    
    const startMonth = new Date(queryYear, queryMonth - 1, 1);
    const endMonth = new Date(queryYear, queryMonth, 0, 23, 59, 59, 999);

    // 1. Total Members
    const totalMembers = await this.prisma.user.count({
      where: { isActive: true },
    });

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
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
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
      include: {
        items: true,
      },
    });

    const totalMarketingCost = monthMarketings.reduce(
      (sum, m) => sum + Number(m.totalAmount),
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
    const allBalances = await this.prisma.userBalance.findMany({});
    const totalDue = allBalances.reduce((sum, b) => sum + Number(b.balance), 0);

    // 8. Meal Rate (Live calculation matching generation logic)
    const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const prevSummary = await this.prisma.monthlySummary.findFirst({
      where: { monthYear: prevMonthDate }
    });
    const adjPrev = prevSummary ? Number(prevSummary.adjustmentToNext) : 0;

    const currMonthDate = new Date(queryYear, queryMonth - 1, 1);
    const currSummary = await this.prisma.monthlySummary.findFirst({
      where: { monthYear: currMonthDate }
    });
    const adjNext = currSummary ? Number(currSummary.adjustmentToNext) : 0;

    const monthShopDebts = await this.prisma.shopDebt.findMany({
      where: {
        date: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    });
    const totalShopDebtCost = monthShopDebts.reduce((sum, d) => sum + Number(d.amount), 0);
    
    const netMarketCost = totalMarketingCost + totalShopDebtCost + adjPrev - adjNext;
    const mealRate = currSummary ? Number(currSummary.mealRate) : 0;

    // 9. Inventory - Get all inventory items grouped by category
    const inventoryItems = await this.prisma.inventoryItem.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    // Group inventory by category with proper structure
    const inventory: Record<string, InventoryCategoryDto> = {};

    for (const item of inventoryItems) {
      const category = item.category;
      if (!inventory[category]) {
        inventory[category] = {
          items: [],
          totalItems: 0,
          lowStockItems: 0,
        };
      }

      const quantity = Number(item.quantity);
      const minStock = Number(item.minStockLevel);
      const status = quantity <= minStock && minStock > 0 ? "LOW_STOCK" : "OK";

      // ✅ Fix: Remove 'unit' field
      inventory[category].items.push({
        name: item.name,
        quantity: quantity,
        minStockLevel: minStock,
        status: status,
      });

      inventory[category].totalItems++;
      if (status === "LOW_STOCK") {
        inventory[category].lowStockItems++;
      }
    }

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
        items: true,
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

    // 11. Check low inventory and send notifications
    const lowStockItems = inventoryItems.filter(
      (item) =>
        Number(item.quantity) <= Number(item.minStockLevel) &&
        Number(item.minStockLevel) > 0,
    );

    if (lowStockItems.length > 0) {
      const admins = await this.prisma.user.findMany({
        where: {
          role: "ADMIN",
          isActive: true,
        },
      });

      for (const admin of admins) {
        for (const item of lowStockItems) {
          try {
            // ✅ Fix: Remove 'unit' from message
            await this.notificationsService.create({
              userId: admin.id,
              type: "STOCK_ALERT",
              title: `Low Stock Alert: ${item.name}`,
              message: `${item.name} is running low. Current stock: ${Number(item.quantity)}. Minimum required: ${Number(item.minStockLevel)}.`,
              link: "/inventory",
            });
          } catch (error) {
            console.error("Failed to send inventory notification:", error);
          }
        }
      }
    }

    // 12. Get meal breakdown for today
    const mealBreakdown = await this.getMealBreakdown(today);

    // 12. Get Admin's Personal Stats
    const myStats = await this.getMemberDashboard(userId);

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
      mealsLunch: mealBreakdown.lunch,
      mealsDinner: mealBreakdown.dinner,
      inventory: inventory,
      recentActivities: {
        meals: recentMeals.map((m) => ({
          id: m.id,
          date: m.date,
          lunch: m.lunch,
          dinner: m.dinner,
          totalMeal: m.totalMeal,
          userName: m.user?.name || "Unknown",
          userId: m.userId || "",
        })),
        marketings: recentMarketings.map((m) => ({
          id: m.id,
          date: m.date,
          itemName:
            m.items?.length > 0
              ? m.items.map((i) => i.itemName).join(", ")
              : "Multiple Items",
          amount: m.totalAmount,
          shopName: m.shopName,
          userName: m.user?.name || "Unknown",
          userId: m.userId || "",
        })),
        payments: recentPayments.map((p) => ({
          id: p.id,
          amount: p.amount,
          paymentDate: p.paymentDate,
          paymentMethod: p.paymentMethod,
          note: p.note,
          userName: p.user?.name || "Unknown",
          userId: p.userId || "",
        })),
      },
      myStats,
    };
  }

  // ==================== MEMBER DASHBOARD ====================

  async getMemberDashboard(userId: string, year?: number, month?: number): Promise<MemberDashboardDto> {
    if (!userId) {
      throw new BadRequestException("User ID is required");
    }

    const today = new Date();
    const queryYear = year || today.getFullYear();
    const queryMonth = month || today.getMonth() + 1;

    const startMonth = new Date(queryYear, queryMonth - 1, 1);
    const endMonth = new Date(queryYear, queryMonth, 0, 23, 59, 59, 999);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userBalance: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

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

    const monthlySummary = await this.prisma.monthlySummary.findFirst({
      where: {
        userId,
        monthYear: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    });

    const userBalance = await this.prisma.userBalance.findUnique({
      where: { userId },
    });

    const recentPayments = await this.prisma.payment.findMany({
      where: { userId },
      take: 5,
      orderBy: { paymentDate: "desc" },
      select: {
        id: true,
        amount: true,
        paymentDate: true,
        paymentMethod: true,
        note: true,
      },
    });

    const recentMeals = await this.prisma.meal.findMany({
      where: { userId },
      take: 5,
      orderBy: { date: "desc" },
      select: {
        id: true,
        date: true,
        lunch: true,
        dinner: true,
        totalMeal: true,
      },
    });

    const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const prevSummary = await this.prisma.monthlySummary.findFirst({
      where: { monthYear: prevMonthDate }
    });
    const adjPrev = prevSummary ? Number(prevSummary.adjustmentToNext) : 0;

    const currMonthDate = new Date(queryYear, queryMonth - 1, 1);
    const currSummary = await this.prisma.monthlySummary.findFirst({
      where: { monthYear: currMonthDate }
    });
    const adjNext = currSummary ? Number(currSummary.adjustmentToNext) : 0;

    const monthMarketings = await this.prisma.marketing.findMany({
      where: {
        date: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    });
    const totalMarketingCost = monthMarketings.reduce((sum, m) => sum + Number(m.totalAmount), 0);

    const monthShopDebts = await this.prisma.shopDebt.findMany({
      where: {
        date: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    });
    const totalShopDebtCost = monthShopDebts.reduce((sum, d) => sum + Number(d.amount), 0);
    
    const allMealsThisMonth = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    });
    const totalMealsThisMonth = allMealsThisMonth.reduce((sum, m) => sum + m.totalMeal, 0);

    const netMarketCost = totalMarketingCost + totalShopDebtCost + adjPrev - adjNext;
    const currentMealRate = currSummary ? Number(currSummary.mealRate) : 0;

    const balance = monthlySummary ? -Number(monthlySummary.currentDue) : 0;

    if (balance < 0) {
      try {
        await this.notificationsService.create({
          userId: userId,
          type: "BILL",
          title: "Due Balance Alert",
          message: `You have a due balance of ${Math.abs(balance)} TK. Please pay as soon as possible.`,
          link: "/payments",
        });
      } catch (error) {
        console.error("Failed to send due balance notification:", error);
      }
    }

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
      currentBalance: balance,
      mealRate: currentMealRate,
      recentPayments,
      recentMeals,
    };
  }

  // ==================== DAILY SUMMARY ====================

  async getDailySummary(date?: string): Promise<DailySummaryDto> {
    let queryDate: Date;
    if (date) {
      queryDate = parseISO(date);
      if (!isValid(queryDate)) {
        throw new BadRequestException("Invalid date format. Use YYYY-MM-DD");
      }
    } else {
      queryDate = new Date();
    }

    const start = startOfDay(queryDate);
    const end = endOfDay(queryDate);

    const meals = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const totalMeals = meals.reduce((sum, m) => sum + m.totalMeal, 0);
    const totalLunch = meals.filter((m) => m.lunch).length;
    const totalDinner = meals.filter((m) => m.dinner).length;

    const marketings = await this.prisma.marketing.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        items: true,
      },
    });

    const totalMarketingCost = marketings.reduce(
      (sum, m) => sum + Number(m.totalAmount),
      0,
    );

    const dailySummary = await this.prisma.dailySummary.findUnique({
      where: {
        date: start,
      },
    });

    return {
      date: format(queryDate, "yyyy-MM-dd"),
      totalMeals,
      totalLunch,
      totalDinner,
      totalMarketingCost: Number(totalMarketingCost),
      mealRate: dailySummary ? Number(dailySummary.mealRate) : 0,
    };
  }

  // ==================== MONTHLY SUMMARY FOR DASHBOARD ====================

  async getMonthlySummaryForDashboard(
    year?: number,
    month?: number,
  ): Promise<MonthlySummaryDto> {
    const currentDate = new Date();
    const queryYear = year || currentDate.getFullYear();
    const queryMonth = month || currentDate.getMonth() + 1;

    if (queryYear < 2000 || queryYear > 2100) {
      throw new BadRequestException(
        "Invalid year. Year must be between 2000 and 2100",
      );
    }
    if (queryMonth < 1 || queryMonth > 12) {
      throw new BadRequestException(
        "Invalid month. Month must be between 1 and 12",
      );
    }

    const startDate = new Date(queryYear, queryMonth - 1, 1);
    const endDate = new Date(queryYear, queryMonth, 0);

    const [
      meals,
      marketings,
      utilityBills,
      payments,
      monthlySummaries,
      memberCount,
    ] = await Promise.all([
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
        include: {
          items: true,
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
              email: true,
            },
          },
        },
      }),
      this.prisma.user.count({
        where: {
          isActive: true,
        },
      }),
    ]);

    const totalMeals = meals.reduce((sum, m) => sum + m.totalMeal, 0);
    const totalMarketingCost = marketings.reduce(
      (sum, m) => sum + Number(m.totalAmount),
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

    const mealRate =
      totalMeals > 0 ? Number(totalMarketingCost / totalMeals) : 0;

    if (totalDue > 5000) {
      try {
        const admins = await this.prisma.user.findMany({
          where: {
            role: "ADMIN",
            isActive: true,
          },
        });

        for (const admin of admins) {
          await this.notificationsService.create({
            userId: admin.id,
            type: "BILL",
            title: "High Due Alert",
            message: `Total due for ${format(startDate, "MMMM yyyy")} is ${totalDue} TK. Please check.`,
            link: "/monthly-summary",
          });
        }
      } catch (error) {
        console.error("Failed to send high due notification:", error);
      }
    }

    return {
      month: format(startDate, "MMMM"),
      year: queryYear,
      totalMeals,
      totalMarketingCost: Number(totalMarketingCost),
      totalUtilityCost: Number(totalUtilityCost),
      totalCost: Number(totalMarketingCost + totalUtilityCost),
      totalPayments: Number(totalPayments),
      totalDue: Number(totalDue),
      mealRate: Number(mealRate),
      totalMembers: memberCount,
      userSummaries: monthlySummaries.map((s) => ({
        userId: s.userId,
        userName: s.user.name,
        userPhone: s.user.phone || undefined,
        userEmail: s.user.email || undefined,
        totalMeal: s.totalMeal,
        mealBill: Number(s.mealBill),
        utilityShare: Number(s.utilityShare),
        totalBill: Number(s.totalBill),
        totalPaid: Number(s.totalPaid),
        previousDue: Number(s.previousDue),
        currentDue: Number(s.currentDue),
      })),
    };
  }

  // ==================== ADDITIONAL METHODS ====================

  async getActivities(
    limit: number = 10,
    offset: number = 0,
  ): Promise<ActivityDto> {
    const [meals, marketings, payments] = await Promise.all([
      this.prisma.meal.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.marketing.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          items: true,
        },
      }),
      this.prisma.payment.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      meals: meals.map((m) => ({
        id: m.id,
        date: m.date,
        lunch: m.lunch,
        dinner: m.dinner,
        totalMeal: m.totalMeal,
        userName: m.user?.name || "Unknown",
        userId: m.userId || "",
      })),
      marketings: marketings.map((m) => ({
        id: m.id,
        date: m.date,
        itemName:
          m.items?.length > 0
            ? m.items.map((i) => i.itemName).join(", ")
            : "Multiple Items",
        amount: m.totalAmount,
        shopName: m.shopName,
        userName: m.user?.name || "Unknown",
        userId: m.userId || "",
      })),
      payments: payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        paymentDate: p.paymentDate,
        paymentMethod: p.paymentMethod,
        note: p.note,
        userName: p.user?.name || "Unknown",
        userId: p.userId || "",
      })),
    };
  }

  async getMealRateHistory(days: number = 30): Promise<MealRateHistoryDto[]> {
    const startDate = subDays(new Date(), days);

    const dailySummaries = await this.prisma.dailySummary.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: "asc" },
      select: {
        date: true,
        mealRate: true,
        dailyTotalMeal: true,
        dailyMarketCost: true,
      },
    });

    return dailySummaries.map((d) => ({
      date: format(d.date, "yyyy-MM-dd"),
      mealRate: Number(d.mealRate),
      totalMeals: d.dailyTotalMeal,
      totalCost: Number(d.dailyMarketCost),
    }));
  }

  async getMemberBalances(year?: number, month?: number): Promise<MemberBalanceDto[]> {
    const summary = await this.getMonthlySummaryForDashboard(year, month);
    
    const balances = summary.userSummaries.map((u) => ({
      userId: u.userId,
      userName: u.userName,
      userEmail: u.userEmail,
      userPhone: u.userPhone,
      totalPaid: u.totalPaid,
      balance: -u.currentDue, // negate currentDue because positive due = negative balance
      lastUpdated: new Date(),
    }));

    return balances.sort((a, b) => b.balance - a.balance);
  }

  async getMessStats(): Promise<MessStatsDto> {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    const [
      totalMembers,
      activeMembers,
      totalMeals,
      totalPayments,
      totalMarketing,
      mealRate,
    ] = await Promise.all([
      this.prisma.user.count({}),
      this.prisma.user.count({
        where: { isActive: true },
      }),
      this.prisma.meal.count({
        where: {
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      }),
      this.prisma.payment.aggregate({
        where: {
          paymentDate: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.marketing.aggregate({
        where: {
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.dailySummary.findFirst({
        orderBy: { date: "desc" },
        select: { mealRate: true },
      }),
    ]);

    const totalDue = await this.calculateTotalDue();

    return {
      totalMembers,
      activeMembers,
      totalMeals,
      totalPayments: Number(totalPayments._sum.amount || 0),
      totalMarketing: Number(totalMarketing._sum.totalAmount || 0),
      totalDue: Number(totalDue),
      mealRate: mealRate ? Number(mealRate.mealRate) : 0,
    };
  }

  async getWeeklySummary(): Promise<WeeklySummaryDto[]> {
    const weekStart = subDays(new Date(), 7);

    const dailySummaries = await this.prisma.dailySummary.findMany({
      where: {
        date: {
          gte: weekStart,
        },
      },
      orderBy: { date: "asc" },
    });

    return dailySummaries.map((d) => ({
      date: format(d.date, "yyyy-MM-dd"),
      totalMeals: d.dailyTotalMeal,
      totalCost: Number(d.dailyMarketCost),
      mealRate: Number(d.mealRate),
    }));
  }

  // ==================== HELPER METHODS ====================

  private async getMealBreakdown(date: Date) {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const meals = await this.prisma.meal.findMany({
      where: {
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    return {
      lunch: meals.filter((m) => m.lunch).length,
      dinner: meals.filter((m) => m.dinner).length,
    };
  }

  private async calculateTotalDue(): Promise<number> {
    const balances = await this.prisma.userBalance.findMany({
      select: {
        balance: true,
      },
    });

    return balances.reduce((sum, b) => sum + Number(b.balance), 0);
  }
}
