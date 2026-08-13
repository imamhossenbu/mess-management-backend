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
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const notifications_service_1 = require("../notifications/notifications.service");
let ShopDebtsService = class ShopDebtsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(createShopDebtDto) {
        const { shopName, date, itemDetails, amount, status, note } = createShopDebtDto;
        const debtDate = date ? new Date(date) : new Date();
        const debt = await this.prisma.shopDebt.create({
            data: {
                shopName,
                date: debtDate,
                itemDetails,
                amount,
                status: status || client_1.DebtStatus.DUE,
                note,
            },
        });
        const admins = await this.prisma.user.findMany({
            where: {
                role: "ADMIN",
                isActive: true,
            },
        });
        for (const admin of admins) {
            await this.notificationsService.create({
                userId: admin.id,
                type: "SYSTEM",
                title: "New Shop Debt Added",
                message: `${shopName}: ${amount} TK debt added for ${(0, date_fns_1.format)(debtDate, "yyyy-MM-dd")}`,
                link: `/shop-debts/${debt.id}`,
            });
        }
        const shopDebts = await this.prisma.shopDebt.findMany({
            where: {
                shopName,
                status: client_1.DebtStatus.DUE,
            },
        });
        const totalShopDebt = shopDebts.reduce((sum, d) => sum + Number(d.amount), 0);
        if (totalShopDebt > 10000) {
            for (const admin of admins) {
                await this.notificationsService.create({
                    userId: admin.id,
                    type: "SYSTEM",
                    title: "High Shop Debt Alert",
                    message: `${shopName} has total due of ${totalShopDebt} TK. Please review.`,
                    link: `/shop-debts/shop/${shopName}`,
                });
            }
        }
        return debt;
    }
    async payDebt(id, paidDate) {
        const debt = await this.prisma.shopDebt.findUnique({
            where: { id },
        });
        if (!debt) {
            throw new common_1.NotFoundException(`Shop debt with ID ${id} not found`);
        }
        if (debt.status === client_1.DebtStatus.PAID) {
            throw new common_1.BadRequestException("This debt is already paid");
        }
        const updated = await this.prisma.shopDebt.update({
            where: { id },
            data: {
                status: client_1.DebtStatus.PAID,
                paidDate: paidDate ? new Date(paidDate) : new Date(),
            },
        });
        const admins = await this.prisma.user.findMany({
            where: {
                role: "ADMIN",
                isActive: true,
            },
        });
        for (const admin of admins) {
            await this.notificationsService.create({
                userId: admin.id,
                type: "SYSTEM",
                title: "Shop Debt Paid",
                message: `${debt.shopName}: ${debt.amount} TK debt has been paid.`,
                link: `/shop-debts/${id}`,
            });
        }
        return updated;
    }
    async findAll() {
        return this.prisma.shopDebt.findMany({
            orderBy: {
                date: "desc",
            },
        });
    }
    async findOne(id) {
        const debt = await this.prisma.shopDebt.findUnique({
            where: { id },
        });
        if (!debt) {
            throw new common_1.NotFoundException(`Shop debt with ID ${id} not found`);
        }
        return debt;
    }
    async findByShop(shopName) {
        return this.prisma.shopDebt.findMany({
            where: {
                shopName: {
                    contains: shopName,
                    mode: "insensitive",
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
        return this.prisma.shopDebt.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findByMonth(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        return this.prisma.shopDebt.findMany({
            where: {
                date: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
            orderBy: {
                date: "desc",
            },
        });
    }
    async getSummary() {
        const allDebts = await this.prisma.shopDebt.findMany();
        const totalDue = allDebts
            .filter((d) => d.status === client_1.DebtStatus.DUE)
            .reduce((sum, d) => sum + Number(d.amount), 0);
        const totalPaid = allDebts
            .filter((d) => d.status === client_1.DebtStatus.PAID)
            .reduce((sum, d) => sum + Number(d.amount), 0);
        const totalAmount = allDebts.reduce((sum, d) => sum + Number(d.amount), 0);
        const shopMap = new Map();
        allDebts.forEach((debt) => {
            const existing = shopMap.get(debt.shopName);
            if (existing) {
                existing.totalAmount += Number(debt.amount);
                if (debt.status === client_1.DebtStatus.DUE) {
                    existing.totalDue += Number(debt.amount);
                }
                else {
                    existing.totalPaid += Number(debt.amount);
                }
            }
            else {
                shopMap.set(debt.shopName, {
                    totalAmount: Number(debt.amount),
                    totalDue: debt.status === client_1.DebtStatus.DUE ? Number(debt.amount) : 0,
                    totalPaid: debt.status === client_1.DebtStatus.PAID ? Number(debt.amount) : 0,
                });
            }
        });
        const shopWiseSummary = Array.from(shopMap.entries()).map(([shopName, data]) => ({
            shopName,
            ...data,
        }));
        if (totalDue > 20000) {
            const admins = await this.prisma.user.findMany({
                where: {
                    role: "ADMIN",
                    isActive: true,
                },
            });
            for (const admin of admins) {
                await this.notificationsService.create({
                    userId: admin.id,
                    type: "SYSTEM",
                    title: "High Total Shop Debt Alert",
                    message: `Total shop debt is ${totalDue} TK across all shops. Please review.`,
                    link: "/shop-debts",
                });
            }
        }
        return {
            totalDue,
            totalPaid,
            totalAmount,
            shopWiseSummary: shopWiseSummary.sort((a, b) => b.totalDue - a.totalDue),
        };
    }
    async getMonthlySummary(year, month) {
        const debts = await this.findByMonth(year, month);
        const totalDebt = debts
            .filter((d) => d.status === client_1.DebtStatus.DUE)
            .reduce((sum, d) => sum + Number(d.amount), 0);
        const totalPaid = debts
            .filter((d) => d.status === client_1.DebtStatus.PAID)
            .reduce((sum, d) => sum + Number(d.amount), 0);
        const currentDue = debts.reduce((sum, d) => sum + Number(d.amount), 0);
        return {
            month: (0, date_fns_1.format)(new Date(year, month - 1, 1), "MMMM"),
            year,
            totalDebt,
            totalPaid,
            currentDue,
            debts,
        };
    }
    async update(id, updateShopDebtDto) {
        const existing = await this.prisma.shopDebt.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Shop debt with ID ${id} not found`);
        }
        const updated = await this.prisma.shopDebt.update({
            where: { id },
            data: {
                shopName: updateShopDebtDto.shopName,
                itemDetails: updateShopDebtDto.itemDetails,
                amount: updateShopDebtDto.amount,
                status: updateShopDebtDto.status,
                paidDate: updateShopDebtDto.paidDate
                    ? new Date(updateShopDebtDto.paidDate)
                    : undefined,
                note: updateShopDebtDto.note,
            },
        });
        const admins = await this.prisma.user.findMany({
            where: {
                role: "ADMIN",
                isActive: true,
            },
        });
        for (const admin of admins) {
            await this.notificationsService.create({
                userId: admin.id,
                type: "SYSTEM",
                title: "Shop Debt Updated",
                message: `${existing.shopName}: Debt updated. New amount: ${updated.amount} TK`,
                link: `/shop-debts/${id}`,
            });
        }
        return updated;
    }
    async remove(id) {
        const debt = await this.prisma.shopDebt.findUnique({
            where: { id },
        });
        if (!debt) {
            throw new common_1.NotFoundException(`Shop debt with ID ${id} not found`);
        }
        await this.prisma.shopDebt.delete({
            where: { id },
        });
        const admins = await this.prisma.user.findMany({
            where: {
                role: "ADMIN",
                isActive: true,
            },
        });
        for (const admin of admins) {
            await this.notificationsService.create({
                userId: admin.id,
                type: "SYSTEM",
                title: "Shop Debt Deleted",
                message: `${debt.shopName}: ${debt.amount} TK debt has been deleted.`,
                link: "/shop-debts",
            });
        }
        return { message: `Shop debt with ID ${id} deleted successfully` };
    }
    async getMonthlySummaryReport(year, month) {
        const debts = await this.findByMonth(year, month);
        const totalDebt = debts
            .filter((d) => d.status === client_1.DebtStatus.DUE)
            .reduce((sum, d) => sum + Number(d.amount), 0);
        const totalPaid = debts
            .filter((d) => d.status === client_1.DebtStatus.PAID)
            .reduce((sum, d) => sum + Number(d.amount), 0);
        const currentDue = debts.reduce((sum, d) => sum + Number(d.amount), 0);
        return {
            month: (0, date_fns_1.format)(new Date(year, month - 1, 1), "MMMM"),
            year,
            totalDebt,
            totalPaid,
            currentDue,
            totalEntries: debts.length,
        };
    }
};
exports.ShopDebtsService = ShopDebtsService;
exports.ShopDebtsService = ShopDebtsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ShopDebtsService);
//# sourceMappingURL=shop-debts.service.js.map