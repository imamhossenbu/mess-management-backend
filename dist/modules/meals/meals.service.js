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
exports.MealsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const date_fns_1 = require("date-fns");
const notifications_service_1 = require("../notifications/notifications.service");
let MealsService = class MealsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(createMealDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: createMealDto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${createMealDto.userId} not found`);
        }
        const date = createMealDto.date ? new Date(createMealDto.date) : new Date();
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
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
            throw new common_1.ConflictException(`Meal already exists for user on ${(0, date_fns_1.format)(date, "yyyy-MM-dd")}`);
        }
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
        await this.updateDailySummary(date);
        const mealType = [];
        if (morning)
            mealType.push("Morning");
        if (lunch)
            mealType.push("Lunch");
        if (dinner)
            mealType.push("Dinner");
        await this.notificationsService.create({
            userId: createMealDto.userId,
            type: "MEAL",
            title: "Meal Entry Added",
            message: `Your meal entry for ${(0, date_fns_1.format)(date, "yyyy-MM-dd")} has been added (${mealType.join(", ")}). Total: ${totalMeal} meal(s)`,
            link: "/meals",
        });
        return meal;
    }
    async bulkEntry(bulkMealDto) {
        const date = new Date(bulkMealDto.date);
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
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
        const uniqueUserIds = [...new Set(allUserIds)];
        const users = await this.prisma.user.findMany({
            where: {
                id: { in: uniqueUserIds },
            },
            select: { id: true },
        });
        const foundUserIds = users.map((u) => u.id);
        const missingUserIds = uniqueUserIds.filter((id) => !foundUserIds.includes(id));
        if (missingUserIds.length > 0) {
            throw new common_1.NotFoundException(`Users not found: ${missingUserIds.join(", ")}`);
        }
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
        await this.updateDailySummary(date);
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
        for (const userId of uniqueUserIds) {
            const morning = morningSet.has(userId);
            const lunch = lunchSet.has(userId);
            const dinner = dinnerSet.has(userId);
            const mealType = [];
            if (morning)
                mealType.push("Morning");
            if (lunch)
                mealType.push("Lunch");
            if (dinner)
                mealType.push("Dinner");
            const totalMeal = (morning ? 1 : 0) + (lunch ? 1 : 0) + (dinner ? 1 : 0);
            await this.notificationsService.create({
                userId,
                type: "MEAL",
                title: "Meal Entry Added",
                message: `Your meal entry for ${(0, date_fns_1.format)(date, "yyyy-MM-dd")} has been added (${mealType.join(", ")}). Total: ${totalMeal} meal(s)`,
                link: "/meals",
            });
        }
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
                message: `Bulk meal entry completed for ${(0, date_fns_1.format)(date, "yyyy-MM-dd")}. Total: ${uniqueUserIds.length} users, ${mealsWithUsers.reduce((sum, m) => sum + m.totalMeal, 0)} meals`,
                link: "/meals",
            });
        }
        return {
            date: (0, date_fns_1.format)(date, "yyyy-MM-dd"),
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
    async singleMealEntry(singleMealDto) {
        const date = new Date(singleMealDto.date);
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
        const mealType = singleMealDto.mealType;
        const users = await this.prisma.user.findMany({
            where: {
                id: { in: singleMealDto.userIds },
            },
            select: { id: true },
        });
        const foundUserIds = users.map((u) => u.id);
        const missingUserIds = singleMealDto.userIds.filter((id) => !foundUserIds.includes(id));
        if (missingUserIds.length > 0) {
            throw new common_1.NotFoundException(`Users not found: ${missingUserIds.join(", ")}`);
        }
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
        const mealPromises = singleMealDto.userIds.map(async (userId) => {
            const existing = existingMap.get(userId);
            if (existing) {
                const updateData = {};
                updateData[mealType] = true;
                const morning = mealType === "morning" ? true : existing.morning;
                const lunch = mealType === "lunch" ? true : existing.lunch;
                const dinner = mealType === "dinner" ? true : existing.dinner;
                const totalMeal = (morning ? 1 : 0) + (lunch ? 1 : 0) + (dinner ? 1 : 0);
                return this.prisma.meal.update({
                    where: { id: existing.id },
                    data: {
                        ...updateData,
                        totalMeal,
                    },
                });
            }
            else {
                const morning = mealType === "morning";
                const lunch = mealType === "lunch";
                const dinner = mealType === "dinner";
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
            }
        });
        await Promise.all(mealPromises);
        await this.updateDailySummary(date);
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
        for (const userId of singleMealDto.userIds) {
            await this.notificationsService.create({
                userId,
                type: "MEAL",
                title: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Meal Updated`,
                message: `Your ${mealType} meal for ${(0, date_fns_1.format)(date, "yyyy-MM-dd")} has been recorded.`,
                link: "/meals",
            });
        }
        return {
            date: (0, date_fns_1.format)(date, "yyyy-MM-dd"),
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Meal with ID ${id} not found`);
        }
        return meal;
    }
    async findByUser(userId, startDate, endDate) {
        const where = { userId };
        if (startDate && endDate) {
            where.date = {
                gte: (0, date_fns_1.startOfDay)(startDate),
                lte: (0, date_fns_1.endOfDay)(endDate),
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
    async findByDate(date) {
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
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
    async getDailySummary(date) {
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
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
        const dailySummary = await this.prisma.dailySummary.findUnique({
            where: {
                date: start,
            },
        });
        return {
            date: (0, date_fns_1.format)(date, "yyyy-MM-dd"),
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
    async getMonthlySummary(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const meals = await this.prisma.meal.findMany({
            where: {
                date: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
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
        const userMap = new Map();
        meals.forEach((meal) => {
            const existing = userMap.get(meal.userId);
            if (existing) {
                existing.morning += meal.morning ? 1 : 0;
                existing.lunch += meal.lunch ? 1 : 0;
                existing.dinner += meal.dinner ? 1 : 0;
                existing.totalMeals += meal.totalMeal;
            }
            else {
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
            month: (0, date_fns_1.format)(new Date(year, month - 1, 1), "MMMM"),
            year,
            totalMorning,
            totalLunch,
            totalDinner,
            totalMeals,
            totalUsers: userMap.size,
            userSummaries: Array.from(userMap.values()).sort((a, b) => b.totalMeals - a.totalMeals),
        };
    }
    async update(id, updateMealDto) {
        const existing = await this.prisma.meal.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Meal with ID ${id} not found`);
        }
        const morning = updateMealDto.morning !== undefined
            ? updateMealDto.morning
            : existing.morning;
        const lunch = updateMealDto.lunch !== undefined ? updateMealDto.lunch : existing.lunch;
        const dinner = updateMealDto.dinner !== undefined
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
        await this.updateDailySummary(meal.date);
        const mealType = [];
        if (morning)
            mealType.push("Morning");
        if (lunch)
            mealType.push("Lunch");
        if (dinner)
            mealType.push("Dinner");
        await this.notificationsService.create({
            userId: existing.userId,
            type: "MEAL",
            title: "Meal Entry Updated",
            message: `Your meal entry for ${(0, date_fns_1.format)(meal.date, "yyyy-MM-dd")} has been updated. New: ${mealType.join(", ")}. Total: ${totalMeal} meal(s)`,
            link: "/meals",
        });
        return meal;
    }
    async remove(id) {
        const meal = await this.prisma.meal.findUnique({
            where: { id },
        });
        if (!meal) {
            throw new common_1.NotFoundException(`Meal with ID ${id} not found`);
        }
        await this.prisma.meal.delete({
            where: { id },
        });
        await this.updateDailySummary(meal.date);
        await this.notificationsService.create({
            userId: meal.userId,
            type: "MEAL",
            title: "Meal Entry Deleted",
            message: `Your meal entry for ${(0, date_fns_1.format)(meal.date, "yyyy-MM-dd")} has been deleted.`,
            link: "/meals",
        });
        return { message: `Meal with ID ${id} deleted successfully` };
    }
    async removeByDate(date) {
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
        const deleted = await this.prisma.meal.deleteMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
        });
        await this.updateDailySummary(date);
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
                message: `${deleted.count} meal entries deleted for ${(0, date_fns_1.format)(date, "yyyy-MM-dd")}`,
                link: "/meals",
            });
        }
        return {
            message: `Deleted ${deleted.count} meals for ${(0, date_fns_1.format)(date, "yyyy-MM-dd")}`,
            count: deleted.count,
        };
    }
    async updateDailySummary(date) {
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
        const meals = await this.prisma.meal.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
        });
        const dailyTotalMeal = meals.reduce((sum, m) => sum + m.totalMeal, 0);
        const previousDay = new Date(date);
        previousDay.setDate(previousDay.getDate() - 1);
        const previousStart = (0, date_fns_1.startOfDay)(previousDay);
        const previousSummary = await this.prisma.dailySummary.findUnique({
            where: {
                date: previousStart,
            },
        });
        const previousRunningCost = previousSummary?.runningMarketCost ||
            new prisma_service_1.PrismaService().$queryRaw `0`;
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
        }
        else {
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
};
exports.MealsService = MealsService;
exports.MealsService = MealsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], MealsService);
//# sourceMappingURL=meals.service.js.map