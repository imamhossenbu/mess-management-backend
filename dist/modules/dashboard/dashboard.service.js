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
    async getAdminDashboard(messId) {
        if (!messId) {
            throw new common_1.BadRequestException("Mess ID is required");
        }
        const today = new Date();
        const startToday = (0, date_fns_1.startOfDay)(today);
        const endToday = (0, date_fns_1.endOfDay)(today);
        const startMonth = (0, date_fns_1.startOfMonth)(today);
        const endMonth = (0, date_fns_1.endOfMonth)(today);
        const totalMembers = await this.prisma.messMember.count({
            where: { messId },
        });
        const activeMembers = await this.prisma.messMember.count({
            where: { messId, isActive: true },
        });
        const todayMeals = await this.prisma.meal.findMany({
            where: {
                messId,
                date: {
                    gte: startToday,
                    lte: endToday,
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
        const totalMealsToday = todayMeals.reduce((sum, m) => sum + m.totalMeal, 0);
        const monthMeals = await this.prisma.meal.findMany({
            where: {
                messId,
                date: {
                    gte: startMonth,
                    lte: endMonth,
                },
            },
        });
        const totalMealsThisMonth = monthMeals.reduce((sum, m) => sum + m.totalMeal, 0);
        const monthMarketings = await this.prisma.marketing.findMany({
            where: {
                messId,
                date: {
                    gte: startMonth,
                    lte: endMonth,
                },
            },
        });
        const totalMarketingCost = monthMarketings.reduce((sum, m) => sum + Number(m.amount), 0);
        const monthUtilityBills = await this.prisma.utilityBill.findMany({
            where: {
                messId,
                monthYear: {
                    gte: startMonth,
                    lte: endMonth,
                },
            },
        });
        const totalUtilityCost = monthUtilityBills.reduce((sum, b) => sum + Number(b.amount), 0);
        const monthPayments = await this.prisma.payment.findMany({
            where: {
                messId,
                paymentDate: {
                    gte: startMonth,
                    lte: endMonth,
                },
            },
        });
        const totalPayments = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const allBalances = await this.prisma.userBalance.findMany({
            where: {
                member: {
                    messId,
                },
            },
        });
        const totalDue = allBalances.reduce((sum, b) => sum + Number(b.balance), 0);
        const dailySummary = await this.prisma.dailySummary.findFirst({
            where: {
                messId,
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
        const inventories = await this.prisma.inventory.findMany({
            where: { messId },
        });
        const meatInventory = inventories.find((i) => i.type === "MEAT");
        const fishInventory = inventories.find((i) => i.type === "FISH");
        const recentMeals = await this.prisma.meal.findMany({
            take: 5,
            where: { messId },
            orderBy: { createdAt: "desc" },
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
        const recentMarketings = await this.prisma.marketing.findMany({
            take: 5,
            where: { messId },
            orderBy: { createdAt: "desc" },
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
        const recentPayments = await this.prisma.payment.findMany({
            take: 5,
            where: { messId },
            orderBy: { createdAt: "desc" },
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
        const meatQty = meatInventory?.quantity || 0;
        const fishQty = fishInventory?.quantity || 0;
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
        if (meatQty < 10) {
            for (const admin of admins) {
                try {
                    await this.notificationsService.sendInventoryAlert("MEAT", meatQty);
                }
                catch (error) {
                    console.error("Failed to send inventory notification:", error);
                }
            }
        }
        if (fishQty < 10) {
            for (const admin of admins) {
                try {
                    await this.notificationsService.sendInventoryAlert("FISH", fishQty);
                }
                catch (error) {
                    console.error("Failed to send inventory notification:", error);
                }
            }
        }
        const mealBreakdown = await this.getMealBreakdown(messId, today);
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
            mealsBreakfast: mealBreakdown.morning,
            mealsLunch: mealBreakdown.lunch,
            mealsDinner: mealBreakdown.dinner,
            inventory: {
                meat: meatQty,
                fish: fishQty,
            },
            recentActivities: {
                meals: recentMeals.map((m) => ({
                    id: m.id,
                    date: m.date,
                    morning: m.morning,
                    lunch: m.lunch,
                    dinner: m.dinner,
                    totalMeal: m.totalMeal,
                    userName: m.member?.user?.name || "Unknown",
                    userId: m.member?.userId || "",
                })),
                marketings: recentMarketings.map((m) => ({
                    id: m.id,
                    date: m.date,
                    itemName: m.itemName,
                    amount: m.amount,
                    quantity: m.quantity,
                    shopName: m.shopName,
                    userName: m.member?.user?.name || "Unknown",
                    userId: m.member?.userId || "",
                })),
                payments: recentPayments.map((p) => ({
                    id: p.id,
                    amount: p.amount,
                    paymentDate: p.paymentDate,
                    paymentMethod: p.paymentMethod,
                    note: p.note,
                    userName: p.member?.user?.name || "Unknown",
                    userId: p.member?.userId || "",
                })),
            },
        };
    }
    async getMemberDashboard(userId) {
        if (!userId) {
            throw new common_1.BadRequestException("User ID is required");
        }
        const today = new Date();
        const startMonth = (0, date_fns_1.startOfMonth)(today);
        const endMonth = (0, date_fns_1.endOfMonth)(today);
        const member = await this.prisma.messMember.findFirst({
            where: {
                userId,
                isActive: true,
            },
            include: {
                user: true,
                mess: true,
                userBalance: true,
            },
        });
        if (!member) {
            throw new common_1.NotFoundException("Member not found");
        }
        const messId = member.messId;
        const meals = await this.prisma.meal.findMany({
            where: {
                memberId: member.id,
                date: {
                    gte: startMonth,
                    lte: endMonth,
                },
            },
        });
        const totalMealThisMonth = meals.reduce((sum, m) => sum + m.totalMeal, 0);
        const monthlySummary = await this.prisma.monthlySummary.findFirst({
            where: {
                memberId: member.id,
                monthYear: {
                    gte: startMonth,
                    lte: endMonth,
                },
            },
        });
        const userBalance = await this.prisma.userBalance.findUnique({
            where: { memberId: member.id },
        });
        const recentPayments = await this.prisma.payment.findMany({
            where: { memberId: member.id },
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
            where: { memberId: member.id },
            take: 5,
            orderBy: { date: "desc" },
            select: {
                id: true,
                date: true,
                morning: true,
                lunch: true,
                dinner: true,
                totalMeal: true,
            },
        });
        const dailySummary = await this.prisma.dailySummary.findFirst({
            where: { messId },
            orderBy: { date: "desc" },
            select: { mealRate: true },
        });
        const balance = userBalance ? Number(userBalance.balance) : 0;
        if (balance < 0) {
            try {
                await this.notificationsService.create({
                    userId: member.userId,
                    type: "BILL",
                    title: "Due Balance Alert",
                    message: `You have a due balance of ${Math.abs(balance)} TK. Please pay as soon as possible.`,
                    link: "/payments",
                });
            }
            catch (error) {
                console.error("Failed to send due balance notification:", error);
            }
        }
        return {
            userId: member.userId,
            userName: member.user.name,
            totalMealThisMonth,
            mealBillThisMonth: monthlySummary ? Number(monthlySummary.mealBill) : 0,
            utilityShareThisMonth: monthlySummary
                ? Number(monthlySummary.utilityShare)
                : 0,
            totalBillThisMonth: monthlySummary ? Number(monthlySummary.totalBill) : 0,
            totalPaidThisMonth: monthlySummary ? Number(monthlySummary.totalPaid) : 0,
            currentBalance: balance,
            mealRate: dailySummary ? Number(dailySummary.mealRate) : 0,
            recentPayments,
            recentMeals,
        };
    }
    async getDailySummary(messId, date) {
        if (!messId) {
            throw new common_1.BadRequestException("Mess ID is required");
        }
        let queryDate;
        if (date) {
            queryDate = (0, date_fns_1.parseISO)(date);
            if (!(0, date_fns_1.isValid)(queryDate)) {
                throw new common_1.BadRequestException("Invalid date format. Use YYYY-MM-DD");
            }
        }
        else {
            queryDate = new Date();
        }
        const start = (0, date_fns_1.startOfDay)(queryDate);
        const end = (0, date_fns_1.endOfDay)(queryDate);
        const meals = await this.prisma.meal.findMany({
            where: {
                messId,
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
                messId,
                date: {
                    gte: start,
                    lte: end,
                },
            },
        });
        const totalMarketingCost = marketings.reduce((sum, m) => sum + Number(m.amount), 0);
        const dailySummary = await this.prisma.dailySummary.findUnique({
            where: {
                messId_date: {
                    messId,
                    date: start,
                },
            },
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
    async getMonthlySummaryForDashboard(messId, year, month) {
        if (!messId) {
            throw new common_1.BadRequestException("Mess ID is required");
        }
        const currentDate = new Date();
        const queryYear = year || currentDate.getFullYear();
        const queryMonth = month || currentDate.getMonth() + 1;
        if (queryYear < 2000 || queryYear > 2100) {
            throw new common_1.BadRequestException("Invalid year. Year must be between 2000 and 2100");
        }
        if (queryMonth < 1 || queryMonth > 12) {
            throw new common_1.BadRequestException("Invalid month. Month must be between 1 and 12");
        }
        const startDate = new Date(queryYear, queryMonth - 1, 1);
        const endDate = new Date(queryYear, queryMonth, 0);
        const [meals, marketings, utilityBills, payments, monthlySummaries, memberCount,] = await Promise.all([
            this.prisma.meal.findMany({
                where: {
                    messId,
                    date: {
                        gte: (0, date_fns_1.startOfDay)(startDate),
                        lte: (0, date_fns_1.endOfDay)(endDate),
                    },
                },
            }),
            this.prisma.marketing.findMany({
                where: {
                    messId,
                    date: {
                        gte: (0, date_fns_1.startOfDay)(startDate),
                        lte: (0, date_fns_1.endOfDay)(endDate),
                    },
                },
            }),
            this.prisma.utilityBill.findMany({
                where: {
                    messId,
                    monthYear: {
                        gte: (0, date_fns_1.startOfDay)(startDate),
                        lte: (0, date_fns_1.endOfDay)(endDate),
                    },
                },
            }),
            this.prisma.payment.findMany({
                where: {
                    messId,
                    paymentDate: {
                        gte: (0, date_fns_1.startOfDay)(startDate),
                        lte: (0, date_fns_1.endOfDay)(endDate),
                    },
                },
            }),
            this.prisma.monthlySummary.findMany({
                where: {
                    messId,
                    monthYear: {
                        gte: (0, date_fns_1.startOfDay)(startDate),
                        lte: (0, date_fns_1.endOfDay)(endDate),
                    },
                },
                include: {
                    member: {
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
                    },
                },
            }),
            this.prisma.messMember.count({
                where: {
                    messId,
                    isActive: true,
                },
            }),
        ]);
        const totalMeals = meals.reduce((sum, m) => sum + m.totalMeal, 0);
        const totalMarketingCost = marketings.reduce((sum, m) => sum + Number(m.amount), 0);
        const totalUtilityCost = utilityBills.reduce((sum, b) => sum + Number(b.amount), 0);
        const totalPayments = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const totalDue = monthlySummaries.reduce((sum, s) => sum + Number(s.currentDue), 0);
        const mealRate = totalMeals > 0 ? Number(totalMarketingCost / totalMeals) : 0;
        if (totalDue > 5000) {
            try {
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
                        type: "BILL",
                        title: "High Due Alert",
                        message: `Total due for ${(0, date_fns_1.format)(startDate, "MMMM yyyy")} is ${totalDue} TK. Please check.`,
                        link: "/monthly-summary",
                    });
                }
            }
            catch (error) {
                console.error("Failed to send high due notification:", error);
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
            mealRate: Number(mealRate),
            totalMembers: memberCount,
            userSummaries: monthlySummaries.map((s) => ({
                userId: s.member.userId,
                userName: s.member.user.name,
                userPhone: s.member.user.phone || undefined,
                userEmail: s.member.user.email || undefined,
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
    async getActivities(messId, limit = 10, offset = 0) {
        if (!messId) {
            throw new common_1.BadRequestException("Mess ID is required");
        }
        const [meals, marketings, payments] = await Promise.all([
            this.prisma.meal.findMany({
                take: limit,
                skip: offset,
                where: { messId },
                orderBy: { createdAt: "desc" },
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
            }),
            this.prisma.marketing.findMany({
                take: limit,
                skip: offset,
                where: { messId },
                orderBy: { createdAt: "desc" },
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
            }),
            this.prisma.payment.findMany({
                take: limit,
                skip: offset,
                where: { messId },
                orderBy: { createdAt: "desc" },
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
            }),
        ]);
        return {
            meals: meals.map((m) => ({
                id: m.id,
                date: m.date,
                morning: m.morning,
                lunch: m.lunch,
                dinner: m.dinner,
                totalMeal: m.totalMeal,
                userName: m.member?.user?.name || "Unknown",
                userId: m.member?.userId || "",
            })),
            marketings: marketings.map((m) => ({
                id: m.id,
                date: m.date,
                itemName: m.itemName,
                amount: m.amount,
                quantity: m.quantity,
                shopName: m.shopName,
                userName: m.member?.user?.name || "Unknown",
                userId: m.member?.userId || "",
            })),
            payments: payments.map((p) => ({
                id: p.id,
                amount: p.amount,
                paymentDate: p.paymentDate,
                paymentMethod: p.paymentMethod,
                note: p.note,
                userName: p.member?.user?.name || "Unknown",
                userId: p.member?.userId || "",
            })),
        };
    }
    async getMealRateHistory(messId, days = 30) {
        if (!messId) {
            throw new common_1.BadRequestException("Mess ID is required");
        }
        const startDate = (0, date_fns_1.subDays)(new Date(), days);
        const dailySummaries = await this.prisma.dailySummary.findMany({
            where: {
                messId,
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
            date: (0, date_fns_1.format)(d.date, "yyyy-MM-dd"),
            mealRate: Number(d.mealRate),
            totalMeals: d.dailyTotalMeal,
            totalCost: Number(d.dailyMarketCost),
        }));
    }
    async getMemberBalances(messId) {
        if (!messId) {
            throw new common_1.BadRequestException("Mess ID is required");
        }
        const balances = await this.prisma.userBalance.findMany({
            where: {
                member: {
                    messId,
                    isActive: true,
                },
            },
            include: {
                member: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                balance: "desc",
            },
        });
        return balances.map((b) => ({
            userId: b.member.userId,
            userName: b.member.user.name,
            userEmail: b.member.user.email || undefined,
            userPhone: b.member.user.phone || undefined,
            balance: Number(b.balance),
            lastUpdated: b.lastUpdated,
        }));
    }
    async getMessStats(messId) {
        if (!messId) {
            throw new common_1.BadRequestException("Mess ID is required");
        }
        const today = new Date();
        const monthStart = (0, date_fns_1.startOfMonth)(today);
        const monthEnd = (0, date_fns_1.endOfMonth)(today);
        const [totalMembers, activeMembers, totalMeals, totalPayments, totalMarketing, mealRate,] = await Promise.all([
            this.prisma.messMember.count({
                where: { messId },
            }),
            this.prisma.messMember.count({
                where: { messId, isActive: true },
            }),
            this.prisma.meal.count({
                where: {
                    messId,
                    date: {
                        gte: monthStart,
                        lte: monthEnd,
                    },
                },
            }),
            this.prisma.payment.aggregate({
                where: {
                    messId,
                    paymentDate: {
                        gte: monthStart,
                        lte: monthEnd,
                    },
                },
                _sum: { amount: true },
            }),
            this.prisma.marketing.aggregate({
                where: {
                    messId,
                    date: {
                        gte: monthStart,
                        lte: monthEnd,
                    },
                },
                _sum: { amount: true },
            }),
            this.prisma.dailySummary.findFirst({
                where: { messId },
                orderBy: { date: "desc" },
                select: { mealRate: true },
            }),
        ]);
        const totalDue = await this.calculateTotalDue(messId);
        return {
            totalMembers,
            activeMembers,
            totalMeals,
            totalPayments: Number(totalPayments._sum.amount || 0),
            totalMarketing: Number(totalMarketing._sum.amount || 0),
            totalDue: Number(totalDue),
            mealRate: mealRate ? Number(mealRate.mealRate) : 0,
        };
    }
    async getWeeklySummary(messId) {
        if (!messId) {
            throw new common_1.BadRequestException("Mess ID is required");
        }
        const weekStart = (0, date_fns_1.subDays)(new Date(), 7);
        const dailySummaries = await this.prisma.dailySummary.findMany({
            where: {
                messId,
                date: {
                    gte: weekStart,
                },
            },
            orderBy: { date: "asc" },
        });
        return dailySummaries.map((d) => ({
            date: (0, date_fns_1.format)(d.date, "yyyy-MM-dd"),
            totalMeals: d.dailyTotalMeal,
            totalCost: Number(d.dailyMarketCost),
            mealRate: Number(d.mealRate),
        }));
    }
    async getRecentActivities(messId) {
        return this.getActivities(messId, 5, 0);
    }
    async getMealBreakdown(messId, date) {
        const dayStart = (0, date_fns_1.startOfDay)(date);
        const dayEnd = (0, date_fns_1.endOfDay)(date);
        const meals = await this.prisma.meal.findMany({
            where: {
                messId,
                date: {
                    gte: dayStart,
                    lte: dayEnd,
                },
            },
        });
        return {
            morning: meals.filter((m) => m.morning).length,
            lunch: meals.filter((m) => m.lunch).length,
            dinner: meals.filter((m) => m.dinner).length,
        };
    }
    async calculateTotalDue(messId) {
        const balances = await this.prisma.userBalance.findMany({
            where: {
                member: {
                    messId,
                },
            },
            select: {
                balance: true,
            },
        });
        return balances.reduce((sum, b) => sum + Number(b.balance), 0);
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map