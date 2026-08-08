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
    async generateMonthlySummary(messId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
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
            throw new common_1.BadRequestException("No active members found in this mess");
        }
        const meals = await this.prisma.meal.findMany({
            where: {
                messId,
                date: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
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
        const marketings = await this.prisma.marketing.findMany({
            where: {
                messId,
                date: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
        });
        const totalMarketCost = marketings.reduce((sum, m) => sum + Number(m.amount), 0);
        const utilityBills = await this.prisma.utilityBill.findMany({
            where: {
                messId,
                monthYear: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
        });
        const totalUtilityCost = utilityBills.reduce((sum, b) => sum + Number(b.amount), 0);
        const memberMealMap = new Map();
        meals.forEach((meal) => {
            const existing = memberMealMap.get(meal.memberId);
            if (existing) {
                existing.totalMeal += meal.totalMeal;
                existing.morning += meal.morning ? 1 : 0;
                existing.lunch += meal.lunch ? 1 : 0;
                existing.dinner += meal.dinner ? 1 : 0;
            }
            else {
                memberMealMap.set(meal.memberId, {
                    totalMeal: meal.totalMeal,
                    morning: meal.morning ? 1 : 0,
                    lunch: meal.lunch ? 1 : 0,
                    dinner: meal.dinner ? 1 : 0,
                });
            }
        });
        const totalMeals = Array.from(memberMealMap.values()).reduce((sum, u) => sum + u.totalMeal, 0);
        const mealRate = totalMeals > 0 ? totalMarketCost / totalMeals : 0;
        const perPersonUtility = totalUtilityCost / members.length;
        const payments = await this.prisma.payment.findMany({
            where: {
                messId,
                paymentDate: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
        });
        const memberPaymentMap = new Map();
        payments.forEach((payment) => {
            const existing = memberPaymentMap.get(payment.memberId) || 0;
            memberPaymentMap.set(payment.memberId, existing + Number(payment.amount));
        });
        const previousMonth = new Date(year, month - 2, 1);
        const previousSummaries = await this.prisma.monthlySummary.findMany({
            where: {
                messId,
                monthYear: previousMonth,
            },
        });
        const previousDueMap = new Map();
        previousSummaries.forEach((summary) => {
            previousDueMap.set(summary.memberId, Number(summary.currentDue));
        });
        const userSummaries = members.map((member) => {
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
        await this.saveMonthlySummary(messId, year, month, userSummaries, {
            totalMeals,
            mealRate,
            totalMarketCost,
            totalUtilityCost,
        });
        await this.notificationsService.sendMonthlySummaryNotification(year, month);
        for (const summary of userSummaries) {
            await this.notificationsService.sendBillNotification(summary.userId, summary.totalBill, new Date(year, month, 15));
            if (summary.currentDue > 0) {
                await this.notificationsService.create({
                    userId: summary.userId,
                    type: "BILL",
                    title: "Payment Reminder",
                    message: `You have a due balance of ${summary.currentDue} TK for ${(0, date_fns_1.format)(startDate, "MMMM yyyy")}. Please pay by 15th of next month.`,
                    link: "/payments",
                });
            }
            if (summary.currentDue < 0) {
                await this.notificationsService.create({
                    userId: summary.userId,
                    type: "BILL",
                    title: "Positive Balance",
                    message: `You have a positive balance of ${Math.abs(summary.currentDue)} TK for ${(0, date_fns_1.format)(startDate, "MMMM yyyy")}. This will be adjusted in next month's bill.`,
                    link: "/payments",
                });
            }
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
        const totalDue = userSummaries.reduce((sum, u) => sum + u.currentDue, 0);
        for (const admin of admins) {
            await this.notificationsService.create({
                userId: admin.userId,
                type: "SUMMARY",
                title: `Monthly Summary Generated - ${(0, date_fns_1.format)(startDate, "MMMM yyyy")}`,
                message: `Monthly summary generated. Total meals: ${totalMeals}, Total bill: ${Number(totalMeals * mealRate + totalUtilityCost)} TK, Total due: ${totalDue} TK`,
                link: `/monthly-summary?year=${year}&month=${month}`,
            });
        }
        return {
            month: (0, date_fns_1.format)(startDate, "MMMM"),
            year,
            totalMeals,
            mealRate: Number(mealRate),
            totalMealBill: Number(totalMeals * mealRate),
            totalUtilityBill: Number(totalUtilityCost),
            totalBill: Number(totalMeals * mealRate + totalUtilityCost),
            totalPaid: Number(Array.from(memberPaymentMap.values()).reduce((a, b) => a + b, 0)),
            totalDue: Number(userSummaries.reduce((sum, u) => sum + u.currentDue, 0)),
            userSummaries,
        };
    }
    async saveMonthlySummary(messId, year, month, userSummaries, totals) {
        const monthYear = new Date(year, month - 1, 1);
        await this.prisma.monthlySummary.deleteMany({
            where: {
                messId,
                monthYear: monthYear,
            },
        });
        const members = await this.prisma.messMember.findMany({
            where: {
                messId,
                userId: { in: userSummaries.map((s) => s.userId) },
            },
        });
        const memberMap = new Map(members.map((m) => [m.userId, m.id]));
        for (const summary of userSummaries) {
            const memberId = memberMap.get(summary.userId);
            if (!memberId)
                continue;
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
        for (const summary of userSummaries) {
            const memberId = memberMap.get(summary.userId);
            if (!memberId)
                continue;
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
    async getMonthlySummary(messId, year, month) {
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
            throw new common_1.NotFoundException(`No summary found for ${(0, date_fns_1.format)(monthYear, "MMMM yyyy")}`);
        }
        const userSummaries = summaries.map((s) => ({
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
        const totalMealBill = summaries.reduce((sum, s) => sum + Number(s.mealBill), 0);
        const totalUtilityBill = summaries.reduce((sum, s) => sum + Number(s.utilityShare), 0);
        const totalBill = summaries.reduce((sum, s) => sum + Number(s.totalBill), 0);
        const totalPaid = summaries.reduce((sum, s) => sum + Number(s.totalPaid), 0);
        const totalDue = summaries.reduce((sum, s) => sum + Number(s.currentDue), 0);
        return {
            month: (0, date_fns_1.format)(monthYear, "MMMM"),
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
    async getUserMonthlySummaries(messId, userId, year, month) {
        const member = await this.prisma.messMember.findFirst({
            where: {
                userId,
                messId,
                isActive: true,
            },
        });
        if (!member) {
            throw new common_1.NotFoundException(`User is not a member of this mess`);
        }
        const where = { messId, memberId: member.id };
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
    async getAllMonthlySummaries(messId) {
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
    async updateMonthlySummary(messId, id, updateDto) {
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
            message: `Your monthly summary for ${(0, date_fns_1.format)(existing.monthYear, "MMMM yyyy")} has been updated. New total bill: ${Number(updated.totalBill)} TK`,
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
    async deleteMonthlySummary(messId, year, month) {
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
            throw new common_1.NotFoundException(`No summary found for ${(0, date_fns_1.format)(monthYear, "MMMM yyyy")}`);
        }
        for (const summary of summaries) {
            await this.notificationsService.create({
                userId: summary.member.userId,
                type: "SUMMARY",
                title: "Monthly Summary Deleted",
                message: `Your monthly summary for ${(0, date_fns_1.format)(monthYear, "MMMM yyyy")} has been deleted. Please contact admin if this was a mistake.`,
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