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
    async create(messId, createShopDebtDto) {
        const { shopName, date, itemDetails, amount, status, note } = createShopDebtDto;
        const debtDate = date ? new Date(date) : new Date();
        const debt = await this.prisma.shopDebt.create({
            data: {
                messId,
                shopName,
                date: debtDate,
                itemDetails,
                amount,
                status: status || client_1.DebtStatus.DUE,
                note,
            },
        });
        await this.updateMonthlySummary(messId, debtDate);
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
                type: "SYSTEM",
                title: "New Shop Debt Added",
                message: `${shopName}: ${amount} TK debt added for ${(0, date_fns_1.format)(debtDate, "yyyy-MM-dd")}`,
                link: `/shop-debts/${debt.id}`,
            });
        }
        const shopDebts = await this.prisma.shopDebt.findMany({
            where: {
                messId,
                shopName,
                status: client_1.DebtStatus.DUE,
            },
        });
        const totalShopDebt = shopDebts.reduce((sum, d) => sum + Number(d.amount), 0);
        if (totalShopDebt > 10000) {
            for (const admin of admins) {
                await this.notificationsService.create({
                    userId: admin.userId,
                    type: "SYSTEM",
                    title: "High Shop Debt Alert",
                    message: `${shopName} has total due of ${totalShopDebt} TK. Please review.`,
                    link: `/shop-debts/shop/${shopName}`,
                });
            }
        }
        return debt;
    }
    async payDebt(messId, id, paidDate) {
        const debt = await this.prisma.shopDebt.findUnique({
            where: { id, messId },
        });
        if (!debt) {
            throw new common_1.NotFoundException(`Shop debt with ID ${id} not found in this mess`);
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
        await this.updateMonthlySummary(messId, debt.date);
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
                type: "SYSTEM",
                title: "Shop Debt Paid",
                message: `${debt.shopName}: ${debt.amount} TK debt has been paid.`,
                link: `/shop-debts/${id}`,
            });
        }
        return updated;
    }
    async findAll(messId) {
        return this.prisma.shopDebt.findMany({
            where: { messId },
            orderBy: {
                date: "desc",
            },
        });
    }
    async findOne(messId, id) {
        const debt = await this.prisma.shopDebt.findUnique({
            where: { id, messId },
        });
        if (!debt) {
            throw new common_1.NotFoundException(`Shop debt with ID ${id} not found in this mess`);
        }
        return debt;
    }
    async findByShop(messId, shopName) {
        return this.prisma.shopDebt.findMany({
            where: {
                messId,
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
    async findByDate(messId, date) {
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
        return this.prisma.shopDebt.findMany({
            where: {
                messId,
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
    async findByMonth(messId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        return this.prisma.shopDebt.findMany({
            where: {
                messId,
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
    async getSummary(messId) {
        const allDebts = await this.prisma.shopDebt.findMany({
            where: { messId },
        });
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
    async getMonthlySummary(messId, year, month) {
        const debts = await this.findByMonth(messId, year, month);
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
    async update(messId, id, updateShopDebtDto) {
        const existing = await this.prisma.shopDebt.findUnique({
            where: { id, messId },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Shop debt with ID ${id} not found in this mess`);
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
        await this.updateMonthlySummary(messId, existing.date);
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
                type: "SYSTEM",
                title: "Shop Debt Updated",
                message: `${existing.shopName}: Debt updated. New amount: ${updated.amount} TK`,
                link: `/shop-debts/${id}`,
            });
        }
        return updated;
    }
    async remove(messId, id) {
        const debt = await this.prisma.shopDebt.findUnique({
            where: { id, messId },
        });
        if (!debt) {
            throw new common_1.NotFoundException(`Shop debt with ID ${id} not found in this mess`);
        }
        await this.prisma.shopDebt.delete({
            where: { id },
        });
        await this.updateMonthlySummary(messId, debt.date);
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
                type: "SYSTEM",
                title: "Shop Debt Deleted",
                message: `${debt.shopName}: ${debt.amount} TK debt has been deleted.`,
                link: "/shop-debts",
            });
        }
        return { message: `Shop debt with ID ${id} deleted successfully` };
    }
    async updateMonthlySummary(messId, date) {
        const monthYear = new Date(date.getFullYear(), date.getMonth(), 1);
        const startDate = (0, date_fns_1.startOfDay)(monthYear);
        const endDate = (0, date_fns_1.endOfDay)(new Date(date.getFullYear(), date.getMonth() + 1, 0));
        const debts = await this.prisma.shopDebt.findMany({
            where: {
                messId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const totalDebt = debts
            .filter((d) => d.status === client_1.DebtStatus.DUE)
            .reduce((sum, d) => sum + Number(d.amount), 0);
        const totalPaid = debts
            .filter((d) => d.status === client_1.DebtStatus.PAID)
            .reduce((sum, d) => sum + Number(d.amount), 0);
        const currentDue = debts.reduce((sum, d) => sum + Number(d.amount), 0);
        const existing = await this.prisma.shopMonthlySummary.findUnique({
            where: {
                messId_monthYear: {
                    messId,
                    monthYear: startDate,
                },
            },
        });
        if (existing) {
            await this.prisma.shopMonthlySummary.update({
                where: {
                    messId_monthYear: {
                        messId,
                        monthYear: startDate,
                    },
                },
                data: {
                    totalDebt,
                    totalPaid,
                    currentDue,
                },
            });
        }
        else {
            await this.prisma.shopMonthlySummary.create({
                data: {
                    messId,
                    monthYear: startDate,
                    totalDebt,
                    totalPaid,
                    currentDue,
                },
            });
        }
    }
    async getMonthlySummaryReport(messId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const summary = await this.prisma.shopMonthlySummary.findUnique({
            where: {
                messId_monthYear: {
                    messId,
                    monthYear: startDate,
                },
            },
        });
        if (!summary) {
            return {
                month: (0, date_fns_1.format)(startDate, "MMMM"),
                year,
                totalDebt: 0,
                totalPaid: 0,
                currentDue: 0,
                message: "No data for this month",
            };
        }
        return {
            month: (0, date_fns_1.format)(startDate, "MMMM"),
            year,
            totalDebt: Number(summary.totalDebt),
            totalPaid: Number(summary.totalPaid),
            currentDue: Number(summary.currentDue),
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