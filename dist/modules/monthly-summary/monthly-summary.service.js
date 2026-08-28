"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlySummaryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const date_fns_1 = require("date-fns");
const notifications_service_1 = require("../notifications/notifications.service");
let MonthlySummaryService = class MonthlySummaryService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async generateMonthlySummary(year, month, adjustmentFromPrevious, adjustmentToNext) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const users = await this.prisma.user.findMany({
            where: {
                isActive: true,
            },
            include: {
                userBalance: true,
            },
        });
        if (users.length === 0) {
            throw new common_1.BadRequestException("No active users found");
        }
        const meals = await this.prisma.meal.findMany({
            where: {
                date: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
            include: {
                user: true,
            },
        });
        const marketings = await this.prisma.marketing.findMany({
            where: {
                date: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
            include: {
                items: true,
            },
        });
        const totalMarketCost = marketings.reduce((sum, m) => sum + Number(m.totalAmount), 0);
        const utilityBills = await this.prisma.utilityBill.findMany({
            where: {
                monthYear: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
        });
        const totalUtilityCost = utilityBills.reduce((sum, b) => sum + Number(b.amount), 0);
        const shopDebts = await this.prisma.shopDebt.findMany({
            where: {
                date: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
        });
        const totalShopDebtCost = shopDebts.reduce((sum, d) => sum + Number(d.amount), 0);
        const userMealMap = new Map();
        meals.forEach((meal) => {
            const existing = userMealMap.get(meal.userId);
            if (existing) {
                existing.totalMeal += meal.totalMeal;
                existing.morning += meal.morning ? 1 : 0;
                existing.lunch += meal.lunch ? 1 : 0;
                existing.dinner += meal.dinner ? 1 : 0;
            }
            else {
                userMealMap.set(meal.userId, {
                    totalMeal: meal.totalMeal,
                    morning: meal.morning ? 1 : 0,
                    lunch: meal.lunch ? 1 : 0,
                    dinner: meal.dinner ? 1 : 0,
                });
            }
        });
        const totalMeals = Array.from(userMealMap.values()).reduce((sum, u) => sum + u.totalMeal, 0);
        const adjPrev = Number(adjustmentFromPrevious) || 0;
        const adjNext = Number(adjustmentToNext) || 0;
        const netMarketCost = totalMarketCost + totalShopDebtCost + adjPrev - adjNext;
        const mealRate = totalMeals > 0 ? netMarketCost / totalMeals : 0;
        const perPersonUtility = totalUtilityCost / users.length;
        const payments = await this.prisma.payment.findMany({
            where: {
                paymentDate: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
        });
        const userPaymentMap = new Map();
        payments.forEach((payment) => {
            const existing = userPaymentMap.get(payment.userId) || 0;
            userPaymentMap.set(payment.userId, existing + Number(payment.amount));
        });
        const previousDueMap = new Map();
        const userSummaries = users.map((user) => {
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
        await this.saveMonthlySummary(year, month, userSummaries, {
            totalMeals,
            mealRate,
            totalMarketCost: netMarketCost,
            totalUtilityCost,
            adjustmentFromPrevious: adjPrev,
            adjustmentToNext: adjNext,
        });
        await this.sendNotifications(year, month, userSummaries);
        return {
            month: (0, date_fns_1.format)(startDate, "MMMM"),
            year,
            totalMeals,
            mealRate: Number(mealRate),
            totalMealBill: Number(totalMeals * mealRate),
            totalUtilityBill: Number(totalUtilityCost),
            totalBill: Number(totalMeals * mealRate + totalUtilityCost),
            totalPaid: Number(Array.from(userPaymentMap.values()).reduce((a, b) => a + b, 0)),
            totalDue: Number(userSummaries.reduce((sum, u) => sum + u.currentDue, 0)),
            userSummaries,
        };
    }
    async saveMonthlySummary(year, month, userSummaries, totals) {
        const monthYear = new Date(year, month - 1, 1);
        await this.prisma.monthlySummary.deleteMany({
            where: {
                monthYear: monthYear,
            },
        });
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
            }
        }
    }
    async sendNotifications(year, month, userSummaries) {
        const startDate = new Date(year, month - 1, 1);
        for (const summary of userSummaries) {
            await this.notificationsService.create({
                userId: summary.userId,
                type: "BILL",
                title: `Monthly Bill - ${(0, date_fns_1.format)(startDate, "MMMM yyyy")}`,
                message: `Your total bill: ${summary.totalBill} TK. Paid: ${summary.totalPaid} TK. Due: ${summary.currentDue} TK`,
                link: `/monthly-summary?year=${year}&month=${month}`,
            });
            if (summary.currentDue > 0) {
                await this.notificationsService.create({
                    userId: summary.userId,
                    type: "BILL",
                    title: "Payment Reminder",
                    message: `You have a due balance of ${summary.currentDue} TK for ${(0, date_fns_1.format)(startDate, "MMMM yyyy")}. Please pay by 15th of next month.`,
                    link: "/payments",
                });
            }
        }
        const admins = await this.prisma.user.findMany({
            where: { role: "ADMIN", isActive: true },
        });
        const totalDue = userSummaries.reduce((sum, u) => sum + u.currentDue, 0);
        for (const admin of admins) {
            await this.notificationsService.create({
                userId: admin.id,
                type: "SUMMARY",
                title: `Monthly Summary Generated - ${(0, date_fns_1.format)(startDate, "MMMM yyyy")}`,
                message: `Monthly summary generated. Total users: ${userSummaries.length}, Total due: ${totalDue} TK`,
                link: `/monthly-summary?year=${year}&month=${month}`,
            });
        }
    }
    async getMonthlySummary(year, month) {
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
                month: (0, date_fns_1.format)(monthYear, "MMMM"),
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
        const userSummaries = summaries.map((s) => ({
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
        const totalMealBill = summaries.reduce((sum, s) => sum + Number(s.mealBill), 0);
        const totalUtilityBill = summaries.reduce((sum, s) => sum + Number(s.utilityShare), 0);
        const totalBill = summaries.reduce((sum, s) => sum + Number(s.totalBill), 0);
        const totalPaid = summaries.reduce((sum, s) => sum + Number(s.totalPaid), 0);
        const totalDue = summaries.reduce((sum, s) => sum + Number(s.currentDue), 0);
        return {
            isGenerated: true,
            month: (0, date_fns_1.format)(monthYear, "MMMM"),
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
    async getUserMonthlySummaries(userId, year, month) {
        const where = { userId };
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
            throw new common_1.NotFoundException(`No summaries found for user ${userId}`);
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
    async updateMonthlySummary(id, updateDto) {
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
            throw new common_1.NotFoundException(`Monthly summary with ID ${id} not found`);
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
            message: `Your monthly summary for ${(0, date_fns_1.format)(existing.monthYear, "MMMM yyyy")} has been updated. New total bill: ${Number(updated.totalBill)} TK`,
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
    async deleteMonthlySummary(year, month) {
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
            throw new common_1.NotFoundException(`No summary found for ${(0, date_fns_1.format)(monthYear, "MMMM yyyy")}`);
        }
        for (const summary of summaries) {
            await this.notificationsService.create({
                userId: summary.userId,
                type: "SUMMARY",
                title: "Monthly Summary Deleted",
                message: `Your monthly summary for ${(0, date_fns_1.format)(monthYear, "MMMM yyyy")} has been deleted. Please contact admin if this was a mistake.`,
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
                message: `${deleted.count} summaries deleted for ${(0, date_fns_1.format)(monthYear, "MMMM yyyy")}`,
                link: "/monthly-summary",
            });
        }
        return {
            message: `Deleted ${deleted.count} summaries for ${(0, date_fns_1.format)(monthYear, "MMMM yyyy")}`,
            count: deleted.count,
        };
    }
};
exports.MonthlySummaryService = MonthlySummaryService;
exports.MonthlySummaryService = MonthlySummaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], MonthlySummaryService);
//# sourceMappingURL=monthly-summary.service.js.map