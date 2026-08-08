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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const date_fns_1 = require("date-fns");
const notifications_service_1 = require("../notifications/notifications.service");
let DashboardService = class DashboardService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async getAdminDashboard() {
        const today = new Date();
        const startToday = (0, date_fns_1.startOfDay)(today);
        const endToday = (0, date_fns_1.endOfDay)(today);
        const startMonth = (0, date_fns_1.startOfMonth)(today);
        const endMonth = (0, date_fns_1.endOfMonth)(today);
        const totalMembers = await this.prisma.user.count();
        const activeMembers = await this.prisma.user.count({
            where: { isActive: true },
        });
        const todayMeals = await this.prisma.meal.findMany({
            where: {
                date: {
                    gte: startToday,
                    lte: endToday,
                },
            },
        });
        const totalMealsToday = todayMeals.reduce((sum, m) => sum + m.totalMeal, 0);
        const monthMeals = await this.prisma.meal.findMany({
            where: {
                date: {
                    gte: startMonth,
                    lte: endMonth,
                },
            },
        });
        const totalMealsThisMonth = monthMeals.reduce((sum, m) => sum + m.totalMeal, 0);
        const monthMarketings = await this.prisma.marketing.findMany({
            where: {
                date: {
                    gte: startMonth,
                    lte: endMonth,
                },
            },
        });
        const totalMarketingCost = monthMarketings.reduce((sum, m) => sum + Number(m.amount), 0);
        const monthUtilityBills = await this.prisma.utilityBill.findMany({
            where: {
                monthYear: {
                    gte: startMonth,
                    lte: endMonth,
                },
            },
        });
        const totalUtilityCost = monthUtilityBills.reduce((sum, b) => sum + Number(b.amount), 0);
        const monthPayments = await this.prisma.payment.findMany({
            where: {
                paymentDate: {
                    gte: startMonth,
                    lte: endMonth,
                },
            },
        });
        const totalPayments = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const allBalances = await this.prisma.userBalance.findMany();
        const totalDue = allBalances.reduce((sum, b) => sum + Number(b.balance), 0);
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
        const meatInventory = await this.prisma.inventory.findUnique({
            where: { type: "MEAT" },
        });
        const fishInventory = await this.prisma.inventory.findUnique({
            where: { type: "FISH" },
        });
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
        const meatQty = meatInventory?.quantity || 0;
        const fishQty = fishInventory?.quantity || 0;
        if (meatQty < 10) {
            await this.notificationsService.sendInventoryAlert("MEAT", meatQty);
        }
        if (fishQty < 10) {
            await this.notificationsService.sendInventoryAlert("FISH", fishQty);
        }
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
                meat: meatQty,
                fish: fishQty,
            },
            recentActivities: {
                meals: recentMeals,
                marketings: recentMarketings,
                payments: recentPayments,
            },
        };
    }
    async getMemberDashboard(userId) {
        const today = new Date();
        const startMonth = (0, date_fns_1.startOfMonth)(today);
        const endMonth = (0, date_fns_1.endOfMonth)(today);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
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
        });
        const balance = userBalance ? Number(userBalance.balance) : 0;
        if (balance < 0) {
            await this.notificationsService.create({
                userId: user.id,
                type: "BILL",
                title: "Due Balance Alert",
                message: `You have a due balance of ${Math.abs(balance)} TK. Please pay as soon as possible.`,
                link: "/payments",
            });
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
            recentPayments,
        };
    }
    async getDailySummary(date) {
        const queryDate = date ? new Date(date) : new Date();
        const start = (0, date_fns_1.startOfDay)(queryDate);
        const end = (0, date_fns_1.endOfDay)(queryDate);
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
        const marketings = await this.prisma.marketing.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
        });
        const totalMarketingCost = marketings.reduce((sum, m) => sum + Number(m.amount), 0);
        const dailySummary = await this.prisma.dailySummary.findUnique({
            where: { date: start },
        });
        return {
            date: (0, date_fns_1.format)(queryDate, "yyyy-MM-dd"),
            totalMeals,
            totalMorning,
            totalLunch,
            totalDinner,
            totalMarketingCost: Number(totalMarketingCost),
            mealRate: dailySummary ? Number(dailySummary.mealRate) : 0,
        };
    }
    async getMonthlySummaryForDashboard(year, month) {
        const queryYear = year || new Date().getFullYear();
        const queryMonth = month || new Date().getMonth() + 1;
        const startDate = new Date(queryYear, queryMonth - 1, 1);
        const endDate = new Date(queryYear, queryMonth, 0);
        const [meals, marketings, utilityBills, payments, monthlySummaries] = await Promise.all([
            this.prisma.meal.findMany({
                where: {
                    date: {
                        gte: (0, date_fns_1.startOfDay)(startDate),
                        lte: (0, date_fns_1.endOfDay)(endDate),
                    },
                },
            }),
            this.prisma.marketing.findMany({
                where: {
                    date: {
                        gte: (0, date_fns_1.startOfDay)(startDate),
                        lte: (0, date_fns_1.endOfDay)(endDate),
                    },
                },
            }),
            this.prisma.utilityBill.findMany({
                where: {
                    monthYear: {
                        gte: (0, date_fns_1.startOfDay)(startDate),
                        lte: (0, date_fns_1.endOfDay)(endDate),
                    },
                },
            }),
            this.prisma.payment.findMany({
                where: {
                    paymentDate: {
                        gte: (0, date_fns_1.startOfDay)(startDate),
                        lte: (0, date_fns_1.endOfDay)(endDate),
                    },
                },
            }),
            this.prisma.monthlySummary.findMany({
                where: {
                    monthYear: {
                        gte: (0, date_fns_1.startOfDay)(startDate),
                        lte: (0, date_fns_1.endOfDay)(endDate),
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
        const totalMarketingCost = marketings.reduce((sum, m) => sum + Number(m.amount), 0);
        const totalUtilityCost = utilityBills.reduce((sum, b) => sum + Number(b.amount), 0);
        const totalPayments = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const totalDue = monthlySummaries.reduce((sum, s) => sum + Number(s.currentDue), 0);
        if (totalDue > 5000) {
            const admins = await this.prisma.user.findMany({
                where: {
                    role: { in: ["SUPER_ADMIN", "MANAGER"] },
                    isActive: true,
                },
            });
            for (const admin of admins) {
                await this.notificationsService.create({
                    userId: admin.id,
                    type: "BILL",
                    title: "High Due Alert",
                    message: `Total due for ${(0, date_fns_1.format)(startDate, "MMMM yyyy")} is ${totalDue} TK. Please check.`,
                    link: "/monthly-summary",
                });
            }
        }
        return {
            month: (0, date_fns_1.format)(startDate, "MMMM"),
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map