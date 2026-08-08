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
    async create(messId, createUtilityBillDto) {
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
                messId,
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
                messId,
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
                    },
                },
            },
        });
        const members = await this.prisma.messMember.findMany({
            where: {
                messId,
                isActive: true,
            },
            include: {
                user: true,
            },
        });
        const billTypeLabels = {
            CURRENT: "Electricity",
            WIFI: "Internet",
            RENT: "Rent",
            WATER: "Water",
            KHALA: "Cook",
        };
        for (const member of members) {
            await this.notificationsService.create({
                userId: member.userId,
                type: "BILL",
                title: `New ${billTypeLabels[billType] || billType} Bill Added`,
                message: `${(0, date_fns_1.format)(monthDate, "MMMM yyyy")} ${billTypeLabels[billType] || billType} bill of ${amount} TK has been added.`,
                link: "/utility-bills",
            });
        }
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
                title: "Utility Bill Added",
                message: `${billTypeLabels[billType] || billType} bill of ${amount} TK added for ${(0, date_fns_1.format)(monthDate, "MMMM yyyy")}`,
                link: `/utility-bills/${bill.id}`,
            });
        }
        return bill;
    }
    async findAll(messId) {
        return this.prisma.utilityBill.findMany({
            where: { messId },
            include: {
                payer: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            },
            orderBy: {
                monthYear: "desc",
            },
        });
    }
    async findOne(messId, id) {
        const bill = await this.prisma.utilityBill.findUnique({
            where: { id, messId },
            include: {
                payer: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            },
        });
        if (!bill) {
            throw new common_1.NotFoundException(`Utility bill with ID ${id} not found in this mess`);
        }
        return bill;
    }
    async findByMonth(messId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        return this.prisma.utilityBill.findMany({
            where: {
                messId,
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
                    },
                },
            },
            orderBy: {
                billType: "asc",
            },
        });
    }
    async getMonthlySummary(messId, year, month) {
        const bills = await this.findByMonth(messId, year, month);
        const activeMembers = await this.prisma.messMember.count({
            where: {
                messId,
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
        const perPersonShare = activeMembers > 0 ? totalAmount / activeMembers : 0;
        if (totalAmount > 50000) {
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
            totalMembers: activeMembers,
            bills,
        };
    }
    async getSummary(messId) {
        const bills = await this.prisma.utilityBill.findMany({
            where: { messId },
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
        const activeMembers = await this.prisma.messMember.count({
            where: {
                messId,
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
            perPersonShare: activeMembers > 0 ? totalAmount / activeMembers : 0,
            totalMembers: activeMembers,
        };
    }
    async update(messId, id, updateUtilityBillDto) {
        const existing = await this.prisma.utilityBill.findUnique({
            where: { id, messId },
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
            throw new common_1.NotFoundException(`Utility bill with ID ${id} not found in this mess`);
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
        const members = await this.prisma.messMember.findMany({
            where: {
                messId,
                isActive: true,
            },
            include: {
                user: true,
            },
        });
        for (const member of members) {
            await this.notificationsService.create({
                userId: member.userId,
                type: "BILL",
                title: `Utility Bill Updated`,
                message: `${billTypeLabels[existing.billType] || existing.billType} bill for ${(0, date_fns_1.format)(existing.monthYear, "MMMM yyyy")} has been updated to ${updated.amount} TK.`,
                link: "/utility-bills",
            });
        }
        return updated;
    }
    async remove(messId, id) {
        const bill = await this.prisma.utilityBill.findUnique({
            where: { id, messId },
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
            throw new common_1.NotFoundException(`Utility bill with ID ${id} not found in this mess`);
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
        const members = await this.prisma.messMember.findMany({
            where: {
                messId,
                isActive: true,
            },
            include: {
                user: true,
            },
        });
        for (const member of members) {
            await this.notificationsService.create({
                userId: member.userId,
                type: "BILL",
                title: `Utility Bill Deleted`,
                message: `${billTypeLabels[bill.billType] || bill.billType} bill for ${(0, date_fns_1.format)(bill.monthYear, "MMMM yyyy")} has been deleted.`,
                link: "/utility-bills",
            });
        }
        return { message: `Utility bill with ID ${id} deleted successfully` };
    }
    async removeByMonth(messId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const deleted = await this.prisma.utilityBill.deleteMany({
            where: {
                messId,
                monthYear: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
        });
        if (deleted.count > 0) {
            const members = await this.prisma.messMember.findMany({
                where: {
                    messId,
                    isActive: true,
                },
                include: {
                    user: true,
                },
            });
            for (const member of members) {
                await this.notificationsService.create({
                    userId: member.userId,
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