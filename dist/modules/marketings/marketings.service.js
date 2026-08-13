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
const notifications_service_1 = require("../notifications/notifications.service");
let MarketingsService = class MarketingsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(userId, createMarketingDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, isActive: true },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User not found or inactive`);
        }
        const date = createMarketingDto.date
            ? new Date(createMarketingDto.date)
            : new Date();
        const totalAmount = createMarketingDto.items.reduce((sum, item) => sum + item.totalPrice, 0);
        const marketing = await this.prisma.marketing.create({
            data: {
                userId,
                date: date,
                shopName: createMarketingDto.shopName,
                totalAmount: totalAmount,
                paymentType: createMarketingDto.paymentType || client_1.PaymentType.CASH,
                note: createMarketingDto.note,
                items: {
                    create: createMarketingDto.items.map((item) => ({
                        itemName: item.itemName,
                        quantity: item.quantity,
                        unit: item.unit,
                        price: item.price,
                        totalPrice: item.totalPrice,
                        note: item.note,
                        addedToInventory: false,
                    })),
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
                items: true,
            },
        });
        for (const item of createMarketingDto.items) {
            if (item.addToInventory) {
                await this.addToInventory(item, marketing.id);
            }
        }
        await this.updateDailySummary(date);
        await this.sendNotifications(marketing, user);
        return {
            id: marketing.id,
            userId: marketing.userId,
            date: marketing.date,
            shopName: marketing.shopName,
            totalAmount: Number(marketing.totalAmount),
            paymentType: marketing.paymentType,
            note: marketing.note,
            createdAt: marketing.createdAt,
            updatedAt: marketing.updatedAt,
            userName: marketing.user?.name || "Unknown",
            items: marketing.items.map((i) => ({
                id: i.id,
                itemName: i.itemName,
                quantity: Number(i.quantity),
                unit: i.unit,
                price: Number(i.price),
                totalPrice: Number(i.totalPrice),
                note: i.note,
                addedToInventory: i.addedToInventory,
                inventoryItemId: i.inventoryItemId,
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
            })),
        };
    }
    async addToInventory(item, marketingId) {
        let inventoryItem = await this.prisma.inventoryItem.findFirst({
            where: { name: item.itemName },
        });
        if (!inventoryItem) {
            const category = this.detectCategory(item.itemName);
            inventoryItem = await this.prisma.inventoryItem.create({
                data: {
                    name: item.itemName,
                    category,
                    unit: item.unit,
                    quantity: 0,
                    minStockLevel: 5,
                },
            });
        }
        const marketingItem = await this.prisma.marketingItem.findFirst({
            where: {
                marketingId,
                itemName: item.itemName,
            },
        });
        if (!marketingItem) {
            throw new common_1.NotFoundException(`Marketing item not found`);
        }
        const previousQuantity = Number(inventoryItem.quantity);
        const newQuantity = previousQuantity + item.quantity;
        await this.prisma.inventoryItem.update({
            where: { id: inventoryItem.id },
            data: {
                quantity: newQuantity,
                lastUpdated: new Date(),
            },
        });
        await this.prisma.inventoryLog.create({
            data: {
                inventoryItemId: inventoryItem.id,
                change: item.quantity,
                previousQuantity: previousQuantity,
                newQuantity: newQuantity,
                reason: "PURCHASE",
                note: `Added from marketing ${marketingId}`,
                marketingItemId: marketingItem.id,
            },
        });
        await this.prisma.marketingItem.update({
            where: { id: marketingItem.id },
            data: {
                addedToInventory: true,
                inventoryItemId: inventoryItem.id,
            },
        });
        if (newQuantity <= Number(inventoryItem.minStockLevel)) {
            await this.sendLowStockAlert(inventoryItem.name, newQuantity);
        }
    }
    async findAll() {
        const marketings = await this.prisma.marketing.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
                items: true,
            },
            orderBy: {
                date: "desc",
            },
        });
        return marketings.map((m) => ({
            id: m.id,
            userId: m.userId,
            date: m.date,
            shopName: m.shopName,
            totalAmount: Number(m.totalAmount),
            paymentType: m.paymentType,
            note: m.note,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            userName: m.user?.name || "Unknown",
            items: m.items.map((i) => ({
                id: i.id,
                itemName: i.itemName,
                quantity: Number(i.quantity),
                unit: i.unit,
                price: Number(i.price),
                totalPrice: Number(i.totalPrice),
                note: i.note,
                addedToInventory: i.addedToInventory,
                inventoryItemId: i.inventoryItemId,
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
            })),
        }));
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
                items: true,
            },
        });
        if (!marketing) {
            throw new common_1.NotFoundException(`Marketing with ID ${id} not found`);
        }
        return {
            id: marketing.id,
            userId: marketing.userId,
            date: marketing.date,
            shopName: marketing.shopName,
            totalAmount: Number(marketing.totalAmount),
            paymentType: marketing.paymentType,
            note: marketing.note,
            createdAt: marketing.createdAt,
            updatedAt: marketing.updatedAt,
            userName: marketing.user?.name || "Unknown",
            items: marketing.items.map((i) => ({
                id: i.id,
                itemName: i.itemName,
                quantity: Number(i.quantity),
                unit: i.unit,
                price: Number(i.price),
                totalPrice: Number(i.totalPrice),
                note: i.note,
                addedToInventory: i.addedToInventory,
                inventoryItemId: i.inventoryItemId,
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
            })),
        };
    }
    async findByUser(userId, startDate, endDate) {
        const where = { userId };
        if (startDate && endDate) {
            where.date = {
                gte: (0, date_fns_1.startOfDay)(startDate),
                lte: (0, date_fns_1.endOfDay)(endDate),
            };
        }
        const marketings = await this.prisma.marketing.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
                items: true,
            },
            orderBy: {
                date: "desc",
            },
        });
        return marketings.map((m) => ({
            id: m.id,
            userId: m.userId,
            date: m.date,
            shopName: m.shopName,
            totalAmount: Number(m.totalAmount),
            paymentType: m.paymentType,
            note: m.note,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            userName: m.user?.name || "Unknown",
            items: m.items.map((i) => ({
                id: i.id,
                itemName: i.itemName,
                quantity: Number(i.quantity),
                unit: i.unit,
                price: Number(i.price),
                totalPrice: Number(i.totalPrice),
                note: i.note,
                addedToInventory: i.addedToInventory,
                inventoryItemId: i.inventoryItemId,
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
            })),
        }));
    }
    async findByDate(date) {
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
        const marketings = await this.prisma.marketing.findMany({
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
                items: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return marketings.map((m) => ({
            id: m.id,
            userId: m.userId,
            date: m.date,
            shopName: m.shopName,
            totalAmount: Number(m.totalAmount),
            paymentType: m.paymentType,
            note: m.note,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            userName: m.user?.name || "Unknown",
            items: m.items.map((i) => ({
                id: i.id,
                itemName: i.itemName,
                quantity: Number(i.quantity),
                unit: i.unit,
                price: Number(i.price),
                totalPrice: Number(i.totalPrice),
                note: i.note,
                addedToInventory: i.addedToInventory,
                inventoryItemId: i.inventoryItemId,
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
            })),
        }));
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
                items: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const totalAmount = items.reduce((sum, item) => sum + Number(item.totalAmount), 0);
        const totalCash = items
            .filter((item) => item.paymentType === client_1.PaymentType.CASH)
            .reduce((sum, item) => sum + Number(item.totalAmount), 0);
        const totalDebt = items
            .filter((item) => item.paymentType === client_1.PaymentType.DEBT)
            .reduce((sum, item) => sum + Number(item.totalAmount), 0);
        const totalSelf = items
            .filter((item) => item.paymentType === client_1.PaymentType.SELF)
            .reduce((sum, item) => sum + Number(item.totalAmount), 0);
        if (totalAmount > 10000) {
            const admins = await this.prisma.user.findMany({
                where: { role: "ADMIN", isActive: true },
            });
            for (const admin of admins) {
                await this.notificationsService.create({
                    userId: admin.id,
                    type: "SYSTEM",
                    title: "High Bazar Spending Alert",
                    message: `Total bazar cost for today is ${totalAmount} TK. Please review.`,
                    link: "/marketings",
                });
            }
        }
        return {
            date: (0, date_fns_1.format)(date, "yyyy-MM-dd"),
            totalAmount,
            totalCash,
            totalDebt,
            totalSelf,
            totalItems: items.length,
            items: items.map((m) => ({
                id: m.id,
                userId: m.userId,
                date: m.date,
                shopName: m.shopName,
                totalAmount: Number(m.totalAmount),
                paymentType: m.paymentType,
                note: m.note,
                createdAt: m.createdAt,
                updatedAt: m.updatedAt,
                userName: m.user?.name || "Unknown",
                items: m.items.map((i) => ({
                    id: i.id,
                    itemName: i.itemName,
                    quantity: Number(i.quantity),
                    unit: i.unit,
                    price: Number(i.price),
                    totalPrice: Number(i.totalPrice),
                    note: i.note,
                    addedToInventory: i.addedToInventory,
                    inventoryItemId: i.inventoryItemId,
                    createdAt: i.createdAt,
                    updatedAt: i.updatedAt,
                })),
            })),
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
                items: true,
            },
        });
        const totalAmount = items.reduce((sum, item) => sum + Number(item.totalAmount), 0);
        const totalCash = items
            .filter((item) => item.paymentType === client_1.PaymentType.CASH)
            .reduce((sum, item) => sum + Number(item.totalAmount), 0);
        const totalDebt = items
            .filter((item) => item.paymentType === client_1.PaymentType.DEBT)
            .reduce((sum, item) => sum + Number(item.totalAmount), 0);
        const totalSelf = items
            .filter((item) => item.paymentType === client_1.PaymentType.SELF)
            .reduce((sum, item) => sum + Number(item.totalAmount), 0);
        const categoryMap = new Map();
        for (const item of items) {
            for (const subItem of item.items) {
                const existing = categoryMap.get(subItem.itemName);
                if (existing) {
                    existing.totalAmount += Number(subItem.totalPrice);
                    existing.count += 1;
                }
                else {
                    categoryMap.set(subItem.itemName, {
                        totalAmount: Number(subItem.totalPrice),
                        count: 1,
                    });
                }
            }
        }
        const categorySummary = Array.from(categoryMap.entries()).map(([itemName, data]) => ({
            itemName,
            totalAmount: data.totalAmount,
            count: data.count,
        }));
        if (totalAmount > 50000) {
            const admins = await this.prisma.user.findMany({
                where: { role: "ADMIN", isActive: true },
            });
            for (const admin of admins) {
                await this.notificationsService.create({
                    userId: admin.id,
                    type: "SYSTEM",
                    title: "High Monthly Bazar Spending",
                    message: `Total bazar cost for ${(0, date_fns_1.format)(startDate, "MMMM yyyy")} is ${totalAmount} TK. Please review.`,
                    link: "/marketings/monthly",
                });
            }
        }
        return {
            month: (0, date_fns_1.format)(startDate, "MMMM"),
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
            include: { items: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Marketing with ID ${id} not found`);
        }
        const updated = await this.prisma.marketing.update({
            where: { id },
            data: {
                shopName: updateMarketingDto.shopName,
                paymentType: updateMarketingDto.paymentType,
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
                items: true,
            },
        });
        const admins = await this.prisma.user.findMany({
            where: { role: "ADMIN", isActive: true },
        });
        for (const admin of admins) {
            await this.notificationsService.create({
                userId: admin.id,
                type: "SYSTEM",
                title: "Bazar Entry Updated",
                message: `Bazar entry has been updated. Shop: ${updated.shopName || "N/A"}, Amount: ${updated.totalAmount} TK`,
                link: `/marketings/${id}`,
            });
        }
        return {
            id: updated.id,
            userId: updated.userId,
            date: updated.date,
            shopName: updated.shopName,
            totalAmount: Number(updated.totalAmount),
            paymentType: updated.paymentType,
            note: updated.note,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
            userName: updated.user?.name || "Unknown",
            items: updated.items.map((i) => ({
                id: i.id,
                itemName: i.itemName,
                quantity: Number(i.quantity),
                unit: i.unit,
                price: Number(i.price),
                totalPrice: Number(i.totalPrice),
                note: i.note,
                addedToInventory: i.addedToInventory,
                inventoryItemId: i.inventoryItemId,
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
            })),
        };
    }
    async remove(id) {
        const marketing = await this.prisma.marketing.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!marketing) {
            throw new common_1.NotFoundException(`Marketing with ID ${id} not found`);
        }
        await this.prisma.marketingItem.deleteMany({
            where: { marketingId: id },
        });
        await this.prisma.marketing.delete({
            where: { id },
        });
        const admins = await this.prisma.user.findMany({
            where: { role: "ADMIN", isActive: true },
        });
        for (const admin of admins) {
            await this.notificationsService.create({
                userId: admin.id,
                type: "SYSTEM",
                title: "Bazar Entry Deleted",
                message: `Bazar entry has been deleted. Shop: ${marketing.shopName || "N/A"}, Amount: ${marketing.totalAmount} TK`,
                link: "/marketings",
            });
        }
        return { message: `Marketing with ID ${id} deleted successfully` };
    }
    async sendNotifications(marketing, user) {
        await this.notificationsService.create({
            userId: user.id,
            type: "SYSTEM",
            title: "Bazar Entry Added",
            message: `You have added a bazar entry: ${marketing.shopName || "Bazar"} - ${marketing.totalAmount} TK`,
            link: `/marketings/${marketing.id}`,
        });
        const admins = await this.prisma.user.findMany({
            where: { role: "ADMIN", isActive: true },
        });
        for (const admin of admins) {
            await this.notificationsService.create({
                userId: admin.id,
                type: "SYSTEM",
                title: "New Bazar Entry",
                message: `${user.name} added bazar: ${marketing.shopName || "Bazar"} - ${marketing.totalAmount} TK`,
                link: `/marketings/${marketing.id}`,
            });
        }
    }
    async sendLowStockAlert(itemName, quantity) {
        const admins = await this.prisma.user.findMany({
            where: { role: "ADMIN", isActive: true },
        });
        for (const admin of admins) {
            await this.notificationsService.create({
                userId: admin.id,
                type: "STOCK_ALERT",
                title: `Low Stock: ${itemName}`,
                message: `${itemName} is running low. Current stock: ${quantity}. Please restock soon.`,
                link: "/inventory",
            });
        }
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
        const dailyMarketCost = marketings.reduce((sum, m) => sum + Number(m.totalAmount), 0);
        const previousDay = new Date(date);
        previousDay.setDate(previousDay.getDate() - 1);
        const previousStart = (0, date_fns_1.startOfDay)(previousDay);
        const previousSummary = await this.prisma.dailySummary.findUnique({
            where: {
                date: previousStart,
            },
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
            where: {
                date: start,
            },
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
    detectCategory(name) {
        const nameLower = name.toLowerCase();
        const fishKeywords = [
            "fish",
            "rui",
            "koi",
            "pabda",
            "mrigel",
            "shrimp",
            "chingri",
            "koral",
        ];
        const meatKeywords = ["chicken", "beef", "mutton", "egg"];
        const vegetableKeywords = [
            "potato",
            "onion",
            "garlic",
            "ginger",
            "tomato",
            "chilli",
            "cucumber",
        ];
        const riceKeywords = ["rice", "miniket", "nazirshail", "irri"];
        const oilKeywords = ["oil", "soybean", "mustard"];
        const spiceKeywords = [
            "salt",
            "turmeric",
            "chilli powder",
            "cumin",
            "coriander",
        ];
        const dairyKeywords = ["milk", "yogurt", "butter", "cheese"];
        const fruitKeywords = ["apple", "banana", "orange", "mango"];
        if (fishKeywords.some((k) => nameLower.includes(k)))
            return "FISH";
        if (meatKeywords.some((k) => nameLower.includes(k)))
            return "MEAT";
        if (vegetableKeywords.some((k) => nameLower.includes(k)))
            return "VEGETABLE";
        if (riceKeywords.some((k) => nameLower.includes(k)))
            return "RICE";
        if (oilKeywords.some((k) => nameLower.includes(k)))
            return "OIL";
        if (spiceKeywords.some((k) => nameLower.includes(k)))
            return "SPICE";
        if (dairyKeywords.some((k) => nameLower.includes(k)))
            return "DAIRY";
        if (fruitKeywords.some((k) => nameLower.includes(k)))
            return "FRUIT";
        return "OTHER";
    }
};
exports.MarketingsService = MarketingsService;
exports.MarketingsService = MarketingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], MarketingsService);
//# sourceMappingURL=marketings.service.js.map