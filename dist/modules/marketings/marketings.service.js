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
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const payments_service_1 = require("../payments/payments.service");
let MarketingsService = class MarketingsService {
    constructor(prisma, notificationsService, cloudinaryService, paymentsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.cloudinaryService = cloudinaryService;
        this.paymentsService = paymentsService;
    }
    async create(requestUserId, createMarketingDto, file) {
        const targetUserId = createMarketingDto.memberId || requestUserId;
        const user = await this.prisma.user.findUnique({
            where: { id: targetUserId, isActive: true },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User not found or inactive`);
        }
        let imageUrl = null;
        if (file) {
            try {
                imageUrl = await this.cloudinaryService.uploadFile(file, `marketings/${targetUserId}`);
            }
            catch (error) {
                throw new common_1.BadRequestException("Failed to upload image");
            }
        }
        const date = createMarketingDto.date
            ? new Date(createMarketingDto.date)
            : new Date();
        const totalAmount = createMarketingDto.items.reduce((sum, item) => sum + item.totalPrice, 0);
        const marketing = await this.prisma.marketing.create({
            data: {
                userId: targetUserId,
                date: date,
                shopName: createMarketingDto.shopName,
                totalAmount: totalAmount,
                paymentType: createMarketingDto.paymentType || client_1.PaymentType.CASH,
                note: createMarketingDto.note,
                imageUrl: imageUrl,
                items: {
                    create: createMarketingDto.items.map((item) => ({
                        itemName: item.itemName,
                        quantity: item.quantity !== undefined ? item.quantity : 1,
                        unit: item.unit || "PIECE",
                        price: item.price !== undefined ? item.price : item.totalPrice,
                        totalPrice: item.totalPrice,
                        note: item.note,
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
        await this.updateDailySummary(date);
        await this.sendNotifications(marketing, user);
        if (createMarketingDto.paymentType === client_1.PaymentType.SELF) {
            await this.paymentsService.create({
                userId: targetUserId,
                amount: totalAmount,
                paymentDate: date.toISOString(),
                paymentMethod: "CASH",
                note: `Auto-deposit for SELF payment Bazar (Shop: ${createMarketingDto.shopName || "N/A"})`,
            });
        }
        return {
            id: marketing.id,
            userId: marketing.userId,
            date: marketing.date,
            shopName: marketing.shopName,
            totalAmount: Number(marketing.totalAmount),
            paymentType: marketing.paymentType,
            note: marketing.note,
            imageUrl: marketing.imageUrl,
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
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
            })),
        };
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
            imageUrl: m.imageUrl,
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
            imageUrl: marketing.imageUrl,
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
            imageUrl: m.imageUrl,
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
            imageUrl: m.imageUrl,
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
                imageUrl: m.imageUrl,
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
                    createdAt: i.createdAt,
                    updatedAt: i.updatedAt,
                })),
            })),
        };
    }
    async getMonthlySummary(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const marketings = await this.prisma.marketing.findMany({
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
            orderBy: {
                date: "desc",
            },
        });
        const totalAmount = marketings.reduce((sum, item) => sum + Number(item.totalAmount), 0);
        const totalCash = marketings
            .filter((item) => item.paymentType === client_1.PaymentType.CASH)
            .reduce((sum, item) => sum + Number(item.totalAmount), 0);
        const totalDebt = marketings
            .filter((item) => item.paymentType === client_1.PaymentType.DEBT)
            .reduce((sum, item) => sum + Number(item.totalAmount), 0);
        const totalSelf = marketings
            .filter((item) => item.paymentType === client_1.PaymentType.SELF)
            .reduce((sum, item) => sum + Number(item.totalAmount), 0);
        const categoryMap = new Map();
        for (const item of marketings) {
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
        const formattedMarketings = marketings.map((m) => ({
            id: m.id,
            userId: m.userId,
            date: m.date,
            shopName: m.shopName,
            totalAmount: Number(m.totalAmount),
            paymentType: m.paymentType,
            note: m.note,
            imageUrl: m.imageUrl,
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
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
            })),
        }));
        return {
            month: (0, date_fns_1.format)(startDate, "MMMM"),
            year,
            totalAmount,
            totalCash,
            totalDebt,
            totalSelf,
            totalItems: marketings.length,
            categorySummary: categorySummary.sort((a, b) => b.totalAmount - a.totalAmount),
            marketings: formattedMarketings,
        };
    }
    async update(id, updateMarketingDto, file) {
        const existing = await this.prisma.marketing.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Marketing with ID ${id} not found`);
        }
        let imageUrl = existing.imageUrl;
        if (file) {
            if (existing.imageUrl) {
                await this.cloudinaryService.deleteFile(existing.imageUrl);
            }
            try {
                imageUrl = await this.cloudinaryService.uploadFile(file, `marketings/${existing.userId}`);
            }
            catch (error) {
                throw new common_1.BadRequestException("Failed to upload image");
            }
        }
        else if (updateMarketingDto.removeImage) {
            if (existing.imageUrl) {
                await this.cloudinaryService.deleteFile(existing.imageUrl);
            }
            imageUrl = null;
        }
        const updated = await this.prisma.marketing.update({
            where: { id },
            data: {
                shopName: updateMarketingDto.shopName,
                paymentType: updateMarketingDto.paymentType,
                note: updateMarketingDto.note,
                imageUrl: imageUrl,
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
        if (updateMarketingDto.items && updateMarketingDto.items.length > 0) {
            await this.prisma.marketingItem.deleteMany({
                where: { marketingId: id },
            });
            await this.prisma.marketingItem.createMany({
                data: updateMarketingDto.items.map((item) => ({
                    marketingId: id,
                    itemName: item.itemName,
                    quantity: item.quantity !== undefined ? item.quantity : 1,
                    unit: item.unit || "PIECE",
                    price: item.price !== undefined ? item.price : item.totalPrice,
                    totalPrice: item.totalPrice,
                    note: item.note,
                })),
            });
            const totalAmount = updateMarketingDto.items.reduce((sum, item) => sum + item.totalPrice, 0);
            await this.prisma.marketing.update({
                where: { id },
                data: {
                    totalAmount: totalAmount,
                },
            });
        }
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
        const finalMarketing = await this.prisma.marketing.findUnique({
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
        return {
            id: finalMarketing.id,
            userId: finalMarketing.userId,
            date: finalMarketing.date,
            shopName: finalMarketing.shopName,
            totalAmount: Number(finalMarketing.totalAmount),
            paymentType: finalMarketing.paymentType,
            note: finalMarketing.note,
            imageUrl: finalMarketing.imageUrl,
            createdAt: finalMarketing.createdAt,
            updatedAt: finalMarketing.updatedAt,
            userName: finalMarketing.user?.name || "Unknown",
            items: finalMarketing.items.map((i) => ({
                id: i.id,
                itemName: i.itemName,
                quantity: Number(i.quantity),
                unit: i.unit,
                price: Number(i.price),
                totalPrice: Number(i.totalPrice),
                note: i.note,
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
        if (marketing.imageUrl) {
            await this.cloudinaryService.deleteFile(marketing.imageUrl);
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
    async removeByDate(date) {
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
        const marketings = await this.prisma.marketing.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
            select: { id: true, imageUrl: true },
        });
        for (const marketing of marketings) {
            if (marketing.imageUrl) {
                await this.cloudinaryService.deleteFile(marketing.imageUrl);
            }
        }
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
        notifications_service_1.NotificationsService,
        cloudinary_service_1.CloudinaryService,
        payments_service_1.PaymentsService])
], MarketingsService);
//# sourceMappingURL=marketings.service.js.map