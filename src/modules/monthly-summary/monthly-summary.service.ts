// src/modules/monthly-summary/monthly-summary.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { startOfDay, endOfDay, format } from "date-fns";
import { UserMonthlySummaryDto, MonthlySummaryResponseDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class MonthlySummaryService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ==================== GENERATE MONTHLY SUMMARY ====================

  async generateMonthlySummary(messId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // 1. Get all active members of this mess
    const members = await this.prisma.messMember.findMany({
      where: {
        messId,
        isActive: true,
      },
      include: {
        user: true,
        userBalance: true,
      },
    });

    if (members.length === 0) {
      throw new BadRequestException("No active members found in this mess");
    }

    // 2. Get meals for this month
    const meals = await this.prisma.meal.findMany({
      where: {
        messId,
        date: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    // 3. Get marketing costs for this month
    const marketings = await this.prisma.marketing.findMany({
      where: {
        messId,
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
        messId,
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

    // 5. Calculate total meals per member
    const memberMealMap = new Map<
      string,
      { totalMeal: number; morning: number; lunch: number; dinner: number }
    >();

    meals.forEach((meal) => {
      const existing = memberMealMap.get(meal.memberId);
      if (existing) {
        existing.totalMeal += meal.totalMeal;
        existing.morning += meal.morning ? 1 : 0;
        existing.lunch += meal.lunch ? 1 : 0;
        existing.dinner += meal.dinner ? 1 : 0;
      } else {
        memberMealMap.set(meal.memberId, {
          totalMeal: meal.totalMeal,
          morning: meal.morning ? 1 : 0,
          lunch: meal.lunch ? 1 : 0,
          dinner: meal.dinner ? 1 : 0,
        });
      }
    });

    // 6. Calculate total meals
    const totalMeals = Array.from(memberMealMap.values()).reduce(
      (sum, u) => sum + u.totalMeal,
      0,
    );

    // 7. Calculate meal rate
    const mealRate = totalMeals > 0 ? totalMarketCost / totalMeals : 0;

    // 8. Calculate per person utility share
    const perPersonUtility = totalUtilityCost / members.length;

    // 9. Get payments for this month
    const payments = await this.prisma.payment.findMany({
      where: {
        messId,
        paymentDate: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
    });

    const memberPaymentMap = new Map<string, number>();
    payments.forEach((payment) => {
      const existing = memberPaymentMap.get(payment.memberId) || 0;
      memberPaymentMap.set(payment.memberId, existing + Number(payment.amount));
    });

    // 10. Get previous month's due
    const previousMonth = new Date(year, month - 2, 1);
    const previousSummaries = await this.prisma.monthlySummary.findMany({
      where: {
        messId,
        monthYear: previousMonth,
      },
    });

    const previousDueMap = new Map<string, number>();
    previousSummaries.forEach((summary) => {
      previousDueMap.set(summary.memberId, Number(summary.currentDue));
    });

    // 11. Generate user summaries
    const userSummaries: UserMonthlySummaryDto[] = members.map((member) => {
      const memberMeal = memberMealMap.get(member.id) || {
        totalMeal: 0,
        morning: 0,
        lunch: 0,
        dinner: 0,
      };
      const mealBill = memberMeal.totalMeal * mealRate;
      const utilityShare = perPersonUtility;
      const totalBill = mealBill + utilityShare;
      const totalPaid = memberPaymentMap.get(member.id) || 0;
      const previousDue = previousDueMap.get(member.id) || 0;
      const currentDue = totalBill - totalPaid + previousDue;

      return {
        userId: member.userId,
        userName: member.user.name,
        phone: member.user.phone || "",
        totalMeal: memberMeal.totalMeal,
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
    await this.saveMonthlySummary(messId, year, month, userSummaries, {
      totalMeals,
      mealRate,
      totalMarketCost,
      totalUtilityCost,
    });

    // ✅ Send monthly summary notification to all users
    await this.notificationsService.sendMonthlySummaryNotification(year, month);

    // ✅ Send individual bill notifications to all users
    for (const summary of userSummaries) {
      await this.notificationsService.sendBillNotification(
        summary.userId,
        summary.totalBill,
        new Date(year, month, 15),
      );

      if (summary.currentDue > 0) {
        await this.notificationsService.create({
          userId: summary.userId,
          type: "BILL",
          title: "Payment Reminder",
          message: `You have a due balance of ${summary.currentDue} TK for ${format(startDate, "MMMM yyyy")}. Please pay by 15th of next month.`,
          link: "/payments",
        });
      }

      if (summary.currentDue < 0) {
        await this.notificationsService.create({
          userId: summary.userId,
          type: "BILL",
          title: "Positive Balance",
          message: `You have a positive balance of ${Math.abs(summary.currentDue)} TK for ${format(startDate, "MMMM yyyy")}. This will be adjusted in next month's bill.`,
          link: "/payments",
        });
      }
    }

    // ✅ Send summary notification to admins
    const admins = await this.prisma.messMember.findMany({
      where: {
        messId,
        role: { in: ["SUPER_ADMIN", "ADMIN"] },
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    const totalDue = userSummaries.reduce((sum, u) => sum + u.currentDue, 0);
    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.userId,
        type: "SUMMARY",
        title: `Monthly Summary Generated - ${format(startDate, "MMMM yyyy")}`,
        message: `Monthly summary generated. Total meals: ${totalMeals}, Total bill: ${Number(totalMeals * mealRate + totalUtilityCost)} TK, Total due: ${totalDue} TK`,
        link: `/monthly-summary?year=${year}&month=${month}`,
      });
    }

    return {
      month: format(startDate, "MMMM"),
      year,
      totalMeals,
      mealRate: Number(mealRate),
      totalMealBill: Number(totalMeals * mealRate),
      totalUtilityBill: Number(totalUtilityCost),
      totalBill: Number(totalMeals * mealRate + totalUtilityCost),
      totalPaid: Number(
        Array.from(memberPaymentMap.values()).reduce((a, b) => a + b, 0),
      ),
      totalDue: Number(userSummaries.reduce((sum, u) => sum + u.currentDue, 0)),
      userSummaries,
    };
  }

  // ==================== SAVE TO DATABASE ====================

  private async saveMonthlySummary(
    messId: string,
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
        messId,
        monthYear: monthYear,
      },
    });

    // Get member IDs for each user
    const members = await this.prisma.messMember.findMany({
      where: {
        messId,
        userId: { in: userSummaries.map((s) => s.userId) },
      },
    });

    const memberMap = new Map(members.map((m) => [m.userId, m.id]));

    // Create new summaries
    for (const summary of userSummaries) {
      const memberId = memberMap.get(summary.userId);
      if (!memberId) continue;

      await this.prisma.monthlySummary.create({
        data: {
          messId,
          memberId,
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
      const memberId = memberMap.get(summary.userId);
      if (!memberId) continue;

      const userBalance = await this.prisma.userBalance.findUnique({
        where: { memberId },
      });

      if (userBalance) {
        await this.prisma.userBalance.update({
          where: { memberId },
          data: {
            balance: summary.currentDue,
            lastUpdated: new Date(),
          },
        });
      }
    }
  }

  // ==================== GET MONTHLY SUMMARY ====================

  async getMonthlySummary(
    messId: string,
    year: number,
    month: number,
  ): Promise<MonthlySummaryResponseDto> {
    const monthYear = new Date(year, month - 1, 1);

    const summaries = await this.prisma.monthlySummary.findMany({
      where: {
        messId,
        monthYear: monthYear,
      },
      include: {
        member: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
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
      userId: s.member.userId,
      userName: s.member.user.name,
      phone: s.member.user.phone || "",
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

  async getUserMonthlySummaries(
    messId: string,
    userId: string,
    year?: number,
    month?: number,
  ) {
    const member = await this.prisma.messMember.findFirst({
      where: {
        userId,
        messId,
        isActive: true,
      },
    });

    if (!member) {
      throw new NotFoundException(`User is not a member of this mess`);
    }

    const where: any = { messId, memberId: member.id };

    if (year && month) {
      const monthYear = new Date(year, month - 1, 1);
      where.monthYear = monthYear;
    }

    const summaries = await this.prisma.monthlySummary.findMany({
      where,
      include: {
        member: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
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

  async getAllMonthlySummaries(messId: string) {
    const summaries = await this.prisma.monthlySummary.findMany({
      where: { messId },
      include: {
        member: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: [{ monthYear: "desc" }, { member: { user: { name: "asc" } } }],
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

  async updateMonthlySummary(messId: string, id: string, updateDto: any) {
    const existing = await this.prisma.monthlySummary.findUnique({
      where: { id, messId },
      include: {
        member: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
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
        member: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    await this.notificationsService.create({
      userId: existing.member.userId,
      type: "SUMMARY",
      title: "Monthly Summary Updated",
      message: `Your monthly summary for ${format(existing.monthYear, "MMMM yyyy")} has been updated. New total bill: ${Number(updated.totalBill)} TK`,
      link: `/monthly-summary?year=${existing.monthYear.getFullYear()}&month=${existing.monthYear.getMonth() + 1}`,
    });

    if (updateDto.currentDue !== undefined) {
      await this.prisma.userBalance.update({
        where: { memberId: existing.memberId },
        data: {
          balance: updateDto.currentDue,
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

  async deleteMonthlySummary(messId: string, year: number, month: number) {
    const monthYear = new Date(year, month - 1, 1);

    const summaries = await this.prisma.monthlySummary.findMany({
      where: {
        messId,
        monthYear: monthYear,
      },
      include: {
        member: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const deleted = await this.prisma.monthlySummary.deleteMany({
      where: {
        messId,
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
        userId: summary.member.userId,
        type: "SUMMARY",
        title: "Monthly Summary Deleted",
        message: `Your monthly summary for ${format(monthYear, "MMMM yyyy")} has been deleted. Please contact admin if this was a mistake.`,
        link: "/monthly-summary",
      });
    }

    const admins = await this.prisma.messMember.findMany({
      where: {
        messId,
        role: { in: ["SUPER_ADMIN", "ADMIN"] },
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.userId,
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
