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
exports.ShopDebtsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const date_fns_1 = require("date-fns");
const notifications_service_1 = require("../notifications/notifications.service");
let ShopDebtsService = class ShopDebtsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async createDebt(createShopDebtDto, userId) {
        const { shopName, date, itemDetails, amount, note } = createShopDebtDto;
        const debtDate = date ? new Date(date) : new Date();
        const debt = await this.prisma.shopDebt.create({
            data: {
                shopName: shopName || "Local Shop",
                date: debtDate,
                itemDetails,
                amount,
                note,
                recordedById: userId,
            },
            include: {
                recordedBy: {
                    select: { name: true }
                }
            }
        });
        const admins = await this.prisma.user.findMany({
            where: { role: "ADMIN", isActive: true },
        });
        for (const admin of admins) {
            await this.notificationsService.create({
                userId: admin.id,
                type: "SYSTEM",
                title: "New Shop Debt Added",
                message: `${debt.shopName}: ${amount} TK debt added by ${debt.recordedBy?.name || 'Unknown'}`,
                link: `/shop-debts`,
            });
        }
        return debt;
    }
    async createPayment(createShopPaymentDto, userId) {
        const { shopName, date, amount, note } = createShopPaymentDto;
        const paymentDate = date ? new Date(date) : new Date();
        const payment = await this.prisma.shopPayment.create({
            data: {
                shopName: shopName || "Local Shop",
                date: paymentDate,
                amount,
                note,
                paidById: userId,
            },
            include: {
                paidBy: {
                    select: { name: true }
                }
            }
        });
        const admins = await this.prisma.user.findMany({
            where: { role: "ADMIN", isActive: true },
        });
        for (const admin of admins) {
            await this.notificationsService.create({
                userId: admin.id,
                type: "SYSTEM",
                title: "Shop Debt Paid",
                message: `${payment.shopName}: ${amount} TK paid by ${payment.paidBy?.name || 'Unknown'}`,
                link: `/shop-debts`,
            });
        }
        return payment;
    }
    async getSummary() {
        const allDebts = await this.prisma.shopDebt.findMany();
        const allPayments = await this.prisma.shopPayment.findMany();
        const totalDebt = allDebts.reduce((sum, d) => sum + Number(d.amount), 0);
        const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const currentDue = totalDebt - totalPaid;
        const shopMap = new Map();
        allDebts.forEach((debt) => {
            const existing = shopMap.get(debt.shopName) || { totalDebt: 0, totalPaid: 0, currentDue: 0 };
            existing.totalDebt += Number(debt.amount);
            existing.currentDue += Number(debt.amount);
            shopMap.set(debt.shopName, existing);
        });
        allPayments.forEach((payment) => {
            const existing = shopMap.get(payment.shopName) || { totalDebt: 0, totalPaid: 0, currentDue: 0 };
            existing.totalPaid += Number(payment.amount);
            existing.currentDue -= Number(payment.amount);
            shopMap.set(payment.shopName, existing);
        });
        const shopWiseSummary = Array.from(shopMap.entries()).map(([shopName, data]) => ({
            shopName,
            ...data,
        }));
        return {
            totalDebt,
            totalPaid,
            currentDue,
            shopWiseSummary: shopWiseSummary.sort((a, b) => b.currentDue - a.currentDue),
        };
    }
    async getMonthlyData(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        endDate.setHours(23, 59, 59, 999);
        const debts = await this.prisma.shopDebt.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                recordedBy: {
                    select: { name: true }
                }
            },
            orderBy: { date: "desc" },
        });
        const payments = await this.prisma.shopPayment.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                paidBy: {
                    select: { name: true }
                }
            },
            orderBy: { date: "desc" },
        });
        return {
            month: (0, date_fns_1.format)(startDate, "MMMM"),
            year,
            debts: debts.map(d => ({
                ...d,
                amount: Number(d.amount),
                recordedByName: d.recordedBy?.name || "Unknown"
            })),
            payments: payments.map(p => ({
                ...p,
                amount: Number(p.amount),
                paidByName: p.paidBy?.name || "Unknown"
            })),
        };
    }
    async updateDebt(id, updateShopDebtDto) {
        const existing = await this.prisma.shopDebt.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Shop debt with ID ${id} not found`);
        return this.prisma.shopDebt.update({
            where: { id },
            data: {
                shopName: updateShopDebtDto.shopName,
                itemDetails: updateShopDebtDto.itemDetails,
                amount: updateShopDebtDto.amount,
                note: updateShopDebtDto.note,
                date: updateShopDebtDto.date ? new Date(updateShopDebtDto.date) : undefined,
            },
        });
    }
    async removeDebt(id) {
        const existing = await this.prisma.shopDebt.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Shop debt with ID ${id} not found`);
        await this.prisma.shopDebt.delete({ where: { id } });
        return { message: "Debt deleted successfully" };
    }
    async updatePayment(id, updateShopPaymentDto) {
        const existing = await this.prisma.shopPayment.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Shop payment with ID ${id} not found`);
        return this.prisma.shopPayment.update({
            where: { id },
            data: {
                shopName: updateShopPaymentDto.shopName,
                amount: updateShopPaymentDto.amount,
                note: updateShopPaymentDto.note,
                date: updateShopPaymentDto.date ? new Date(updateShopPaymentDto.date) : undefined,
            },
        });
    }
    async removePayment(id) {
        const existing = await this.prisma.shopPayment.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Shop payment with ID ${id} not found`);
        await this.prisma.shopPayment.delete({ where: { id } });
        return { message: "Payment deleted successfully" };
    }
};
exports.ShopDebtsService = ShopDebtsService;
exports.ShopDebtsService = ShopDebtsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ShopDebtsService);
//# sourceMappingURL=shop-debts.service.js.map