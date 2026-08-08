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
exports.MarketingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const inventory_service_1 = require("../inventory/inventory.service");
let MarketingsService = class MarketingsService {
    constructor(prisma, inventoryService) {
        this.prisma = prisma;
        this.inventoryService = inventoryService;
    }
    async create(createMarketingDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: createMarketingDto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${createMarketingDto.userId} not found`);
        }
        const date = createMarketingDto.date
            ? new Date(createMarketingDto.date)
            : new Date();
        const marketing = await this.prisma.marketing.create({
            data: {
                userId: createMarketingDto.userId,
                date: date,
                itemName: createMarketingDto.itemName,
                quantity: createMarketingDto.quantity,
                amount: createMarketingDto.amount,
                paymentType: createMarketingDto.paymentType || client_1.PaymentType.CASH,
                shopName: createMarketingDto.shopName,
                note: createMarketingDto.note,
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
        if (createMarketingDto.inventoryType && createMarketingDto.totalPieces) {
            const inventoryType = createMarketingDto.inventoryType;
            await this.inventoryService.addInventory({
                type: inventoryType,
                quantity: createMarketingDto.totalPieces,
                marketingId: marketing.id,
                note: `বাজার থেকে ${createMarketingDto.totalPieces} পিস ${createMarketingDto.itemName} কেনা হয়েছে`,
            });
            if (createMarketingDto.usedPieces && createMarketingDto.usedPieces > 0) {
                await this.inventoryService.removeInventory({
                    type: inventoryType,
                    quantity: createMarketingDto.usedPieces,
                    note: `আজকের রান্নায় ${createMarketingDto.usedPieces} পিস ${createMarketingDto.itemName} ব্যবহার করা হয়েছে`,
                });
            }
        }
        await this.updateDailySummary(date);
        return marketing;
    }
    async findAll() {
        return this.prisma.marketing.findMany({
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
        const marketing = await this.prisma.marketing.findUnique({
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
        if (!marketing) {
            throw new common_1.NotFoundException(`Marketing with ID ${id} not found`);
        }
        return marketing;
    }
    async findByUser(userId, startDate, endDate) {
        const where = { userId };
        if (startDate && endDate) {
            where.date = {
                gte: (0, date_fns_1.startOfDay)(startDate),
                lte: (0, date_fns_1.endOfDay)(endDate),
            };
        }
        return this.prisma.marketing.findMany({
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
        return this.prisma.marketing.findMany({
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
                createdAt: "desc",
            },
        });
    }
    async getDailySummary(date) {
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
        const items = await this.prisma.marketing.findMany({
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
                createdAt: "desc",
            },
        });
        const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalCash = items
            .filter((item) => item.paymentType === client_1.PaymentType.CASH)
            .reduce((sum, item) => sum + Number(item.amount), 0);
        const totalDebt = items
            .filter((item) => item.paymentType === client_1.PaymentType.DEBT)
            .reduce((sum, item) => sum + Number(item.amount), 0);
        const totalSelf = items
            .filter((item) => item.paymentType === client_1.PaymentType.SELF)
            .reduce((sum, item) => sum + Number(item.amount), 0);
        return {
            date: (0, date_fns_1.format)(date, "yyyy-MM-dd"),
            totalAmount,
            totalCash,
            totalDebt,
            totalSelf,
            totalItems: items.length,
            items,
        };
    }
    async getMonthlySummary(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const items = await this.prisma.marketing.findMany({
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
        const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalCash = items
            .filter((item) => item.paymentType === client_1.PaymentType.CASH)
            .reduce((sum, item) => sum + Number(item.amount), 0);
        const totalDebt = items
            .filter((item) => item.paymentType === client_1.PaymentType.DEBT)
            .reduce((sum, item) => sum + Number(item.amount), 0);
        const totalSelf = items
            .filter((item) => item.paymentType === client_1.PaymentType.SELF)
            .reduce((sum, item) => sum + Number(item.amount), 0);
        const categoryMap = new Map();
        items.forEach((item) => {
            const existing = categoryMap.get(item.itemName);
            if (existing) {
                existing.totalAmount += Number(item.amount);
                existing.count += 1;
            }
            else {
                categoryMap.set(item.itemName, {
                    totalAmount: Number(item.amount),
                    count: 1,
                });
            }
        });
        const categorySummary = Array.from(categoryMap.entries()).map(([itemName, data]) => ({
            itemName,
            totalAmount: data.totalAmount,
            count: data.count,
        }));
        return {
            month: (0, date_fns_1.format)(new Date(year, month - 1, 1), "MMMM"),
            year,
            totalAmount,
            totalCash,
            totalDebt,
            totalSelf,
            totalItems: items.length,
            categorySummary: categorySummary.sort((a, b) => b.totalAmount - a.totalAmount),
        };
    }
    async update(id, updateMarketingDto) {
        const existing = await this.prisma.marketing.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Marketing with ID ${id} not found`);
        }
        if (updateMarketingDto.userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: updateMarketingDto.userId },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${updateMarketingDto.userId} not found`);
            }
        }
        return this.prisma.marketing.update({
            where: { id },
            data: {
                userId: updateMarketingDto.userId,
                itemName: updateMarketingDto.itemName,
                quantity: updateMarketingDto.quantity,
                amount: updateMarketingDto.amount,
                paymentType: updateMarketingDto.paymentType,
                shopName: updateMarketingDto.shopName,
                note: updateMarketingDto.note,
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
    }
    async remove(id) {
        const marketing = await this.prisma.marketing.findUnique({
            where: { id },
        });
        if (!marketing) {
            throw new common_1.NotFoundException(`Marketing with ID ${id} not found`);
        }
        await this.prisma.marketing.delete({
            where: { id },
        });
        return { message: `Marketing with ID ${id} deleted successfully` };
    }
    async removeByDate(date) {
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
        const deleted = await this.prisma.marketing.deleteMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
        });
        return {
            message: `Deleted ${deleted.count} marketing entries for ${(0, date_fns_1.format)(date, "yyyy-MM-dd")}`,
            count: deleted.count,
        };
    }
    async updateDailySummary(date) {
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
        const marketings = await this.prisma.marketing.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
        });
        const dailyMarketCost = marketings.reduce((sum, m) => sum + Number(m.amount), 0);
        const previousDay = new Date(date);
        previousDay.setDate(previousDay.getDate() - 1);
        const previousStart = (0, date_fns_1.startOfDay)(previousDay);
        const previousSummary = await this.prisma.dailySummary.findUnique({
            where: { date: previousStart },
        });
        const previousRunningCost = previousSummary?.runningMarketCost || 0;
        const meals = await this.prisma.meal.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
        });
        const dailyTotalMeal = meals.reduce((sum, m) => sum + m.totalMeal, 0);
        const runningTotalMeal = (previousSummary?.runningTotalMeal || 0) + dailyTotalMeal;
        const runningMarketCost = Number(previousRunningCost) + dailyMarketCost;
        const mealRate = runningTotalMeal > 0 ? runningMarketCost / runningTotalMeal : 0;
        const existing = await this.prisma.dailySummary.findUnique({
            where: { date: start },
        });
        if (existing) {
            await this.prisma.dailySummary.update({
                where: { date: start },
                data: {
                    dailyMarketCost,
                    dailyTotalMeal,
                    runningMarketCost,
                    runningTotalMeal,
                    mealRate,
                },
            });
        }
        else {
            await this.prisma.dailySummary.create({
                data: {
                    date: start,
                    dailyMarketCost,
                    dailyTotalMeal,
                    runningMarketCost,
                    runningTotalMeal,
                    mealRate,
                },
            });
        }
    }
};
exports.MarketingsService = MarketingsService;
exports.MarketingsService = MarketingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        inventory_service_1.InventoryService])
], MarketingsService);
//# sourceMappingURL=marketings.service.js.map