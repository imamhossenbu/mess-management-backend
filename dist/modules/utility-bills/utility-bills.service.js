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
exports.UtilityBillsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const notifications_service_1 = require("../notifications/notifications.service");
let UtilityBillsService = class UtilityBillsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(createUtilityBillDto) {
        const { billType, monthYear, amount, paidBy, note } = createUtilityBillDto;
        if (paidBy) {
            const user = await this.prisma.user.findUnique({
                where: { id: paidBy },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${paidBy} not found`);
            }
        }
        const monthDate = new Date(monthYear);
        const existing = await this.prisma.utilityBill.findFirst({
            where: {
                billType,
                monthYear: {
                    gte: (0, date_fns_1.startOfDay)(monthDate),
                    lte: (0, date_fns_1.endOfDay)(monthDate),
                },
            },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Bill for ${billType} already exists for ${(0, date_fns_1.format)(monthDate, "MMMM yyyy")}`);
        }
        const bill = await this.prisma.utilityBill.create({
            data: {
                billType,
                monthYear: monthDate,
                amount,
                paidBy: paidBy || null,
                note,
            },
            include: {
                payer: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
            },
        });
        const users = await this.prisma.user.findMany({
            where: {
                isActive: true,
            },
        });
        const billTypeLabels = {
            CURRENT: "Electricity",
            WIFI: "Internet",
            RENT: "Rent",
            WATER: "Water",
            KHALA: "Cook",
        };
        for (const user of users) {
            await this.notificationsService.create({
                userId: user.id,
                type: "BILL",
                title: `New ${billTypeLabels[billType] || billType} Bill Added`,
                message: `${(0, date_fns_1.format)(monthDate, "MMMM yyyy")} ${billTypeLabels[billType] || billType} bill of ${amount} TK has been added.`,
                link: "/utility-bills",
            });
        }
        const admins = await this.prisma.user.findMany({
            where: {
                role: "ADMIN",
                isActive: true,
            },
        });
        for (const admin of admins) {
            await this.notificationsService.create({
                userId: admin.id,
                type: "BILL",
                title: "Utility Bill Added",
                message: `${billTypeLabels[billType] || billType} bill of ${amount} TK added for ${(0, date_fns_1.format)(monthDate, "MMMM yyyy")}`,
                link: `/utility-bills/${bill.id}`,
            });
        }
        return {
            ...bill,
            paidByName: bill.payer?.name || null,
        };
    }
    async findAll() {
        const bills = await this.prisma.utilityBill.findMany({
            include: {
                payer: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                monthYear: "desc",
            },
        });
        return bills.map((b) => ({
            ...b,
            paidByName: b.payer?.name || null,
        }));
    }
    async findOne(id) {
        const bill = await this.prisma.utilityBill.findUnique({
            where: { id },
            include: {
                payer: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
            },
        });
        if (!bill) {
            throw new common_1.NotFoundException(`Utility bill with ID ${id} not found`);
        }
        return {
            ...bill,
            paidByName: bill.payer?.name || null,
        };
    }
    async findByMonth(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const bills = await this.prisma.utilityBill.findMany({
            where: {
                monthYear: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
            include: {
                payer: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                billType: "asc",
            },
        });
        return bills.map((b) => ({
            ...b,
            paidByName: b.payer?.name || null,
        }));
    }
    async getMonthlySummary(year, month) {
        const bills = await this.findByMonth(year, month);
        const activeUsers = await this.prisma.user.count({
            where: {
                isActive: true,
            },
        });
        const totalCurrent = bills
            .filter((b) => b.billType === client_1.BillType.CURRENT)
            .reduce((sum, b) => sum + Number(b.amount), 0);
        const totalWifi = bills
            .filter((b) => b.billType === client_1.BillType.WIFI)
            .reduce((sum, b) => sum + Number(b.amount), 0);
        const totalRent = bills
            .filter((b) => b.billType === client_1.BillType.RENT)
            .reduce((sum, b) => sum + Number(b.amount), 0);
        const totalWater = bills
            .filter((b) => b.billType === client_1.BillType.WATER)
            .reduce((sum, b) => sum + Number(b.amount), 0);
        const totalKhala = bills
            .filter((b) => b.billType === client_1.BillType.KHALA)
            .reduce((sum, b) => sum + Number(b.amount), 0);
        const totalAmount = totalCurrent + totalWifi + totalRent + totalWater + totalKhala;
        const perPersonShare = activeUsers > 0 ? totalAmount / activeUsers : 0;
        if (totalAmount > 50000) {
            const admins = await this.prisma.user.findMany({
                where: {
                    role: "ADMIN",
                    isActive: true,
                },
            });
            for (const admin of admins) {
                await this.notificationsService.create({
                    userId: admin.id,
                    type: "BILL",
                    title: "High Utility Bill Alert",
                    message: `Total utility bill for ${(0, date_fns_1.format)(new Date(year, month - 1, 1), "MMMM yyyy")} is ${totalAmount} TK. Please review.`,
                    link: "/utility-bills",
                });
            }
        }
        return {
            month: (0, date_fns_1.format)(new Date(year, month - 1, 1), "MMMM"),
            year,
            totalCurrent,
            totalWifi,
            totalRent,
            totalWater,
            totalKhala,
            totalAmount,
            perPersonShare,
            totalMembers: activeUsers,
            bills: bills.map((b) => ({
                ...b,
                paidByName: b.payer?.name || null,
            })),
        };
    }
    async getSummary() {
        const bills = await this.prisma.utilityBill.findMany();
        const totalCurrent = bills
            .filter((b) => b.billType === client_1.BillType.CURRENT)
            .reduce((sum, b) => sum + Number(b.amount), 0);
        const totalWifi = bills
            .filter((b) => b.billType === client_1.BillType.WIFI)
            .reduce((sum, b) => sum + Number(b.amount), 0);
        const totalRent = bills
            .filter((b) => b.billType === client_1.BillType.RENT)
            .reduce((sum, b) => sum + Number(b.amount), 0);
        const totalWater = bills
            .filter((b) => b.billType === client_1.BillType.WATER)
            .reduce((sum, b) => sum + Number(b.amount), 0);
        const totalKhala = bills
            .filter((b) => b.billType === client_1.BillType.KHALA)
            .reduce((sum, b) => sum + Number(b.amount), 0);
        const totalAmount = totalCurrent + totalWifi + totalRent + totalWater + totalKhala;
        const activeUsers = await this.prisma.user.count({
            where: {
                isActive: true,
            },
        });
        return {
            totalCurrent,
            totalWifi,
            totalRent,
            totalWater,
            totalKhala,
            totalAmount,
            perPersonShare: activeUsers > 0 ? totalAmount / activeUsers : 0,
            totalMembers: activeUsers,
        };
    }
    async update(id, updateUtilityBillDto) {
        const existing = await this.prisma.utilityBill.findUnique({
            where: { id },
            include: {
                payer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Utility bill with ID ${id} not found`);
        }
        if (updateUtilityBillDto.paidBy) {
            const user = await this.prisma.user.findUnique({
                where: { id: updateUtilityBillDto.paidBy },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${updateUtilityBillDto.paidBy} not found`);
            }
        }
        const updated = await this.prisma.utilityBill.update({
            where: { id },
            data: {
                billType: updateUtilityBillDto.billType,
                amount: updateUtilityBillDto.amount,
                paidBy: updateUtilityBillDto.paidBy || null,
                note: updateUtilityBillDto.note,
            },
            include: {
                payer: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
            },
        });
        const billTypeLabels = {
            CURRENT: "Electricity",
            WIFI: "Internet",
            RENT: "Rent",
            WATER: "Water",
            KHALA: "Cook",
        };
        const users = await this.prisma.user.findMany({
            where: {
                isActive: true,
            },
        });
        for (const user of users) {
            await this.notificationsService.create({
                userId: user.id,
                type: "BILL",
                title: `Utility Bill Updated`,
                message: `${billTypeLabels[existing.billType] || existing.billType} bill for ${(0, date_fns_1.format)(existing.monthYear, "MMMM yyyy")} has been updated to ${updated.amount} TK.`,
                link: "/utility-bills",
            });
        }
        return {
            ...updated,
            paidByName: updated.payer?.name || null,
        };
    }
    async remove(id) {
        const bill = await this.prisma.utilityBill.findUnique({
            where: { id },
            include: {
                payer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!bill) {
            throw new common_1.NotFoundException(`Utility bill with ID ${id} not found`);
        }
        await this.prisma.utilityBill.delete({
            where: { id },
        });
        const billTypeLabels = {
            CURRENT: "Electricity",
            WIFI: "Internet",
            RENT: "Rent",
            WATER: "Water",
            KHALA: "Cook",
        };
        const users = await this.prisma.user.findMany({
            where: {
                isActive: true,
            },
        });
        for (const user of users) {
            await this.notificationsService.create({
                userId: user.id,
                type: "BILL",
                title: `Utility Bill Deleted`,
                message: `${billTypeLabels[bill.billType] || bill.billType} bill for ${(0, date_fns_1.format)(bill.monthYear, "MMMM yyyy")} has been deleted.`,
                link: "/utility-bills",
            });
        }
        return { message: `Utility bill with ID ${id} deleted successfully` };
    }
    async removeByMonth(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const deleted = await this.prisma.utilityBill.deleteMany({
            where: {
                monthYear: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
        });
        if (deleted.count > 0) {
            const users = await this.prisma.user.findMany({
                where: {
                    isActive: true,
                },
            });
            for (const user of users) {
                await this.notificationsService.create({
                    userId: user.id,
                    type: "BILL",
                    title: `Utility Bills Deleted`,
                    message: `${deleted.count} utility bills for ${(0, date_fns_1.format)(startDate, "MMMM yyyy")} have been deleted.`,
                    link: "/utility-bills",
                });
            }
        }
        return {
            message: `Deleted ${deleted.count} utility bills for ${(0, date_fns_1.format)(startDate, "MMMM yyyy")}`,
            count: deleted.count,
        };
    }
};
exports.UtilityBillsService = UtilityBillsService;
exports.UtilityBillsService = UtilityBillsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], UtilityBillsService);
//# sourceMappingURL=utility-bills.service.js.map