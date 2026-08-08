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
let UtilityBillsService = class UtilityBillsService {
    constructor(prisma) {
        this.prisma = prisma;
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
                    },
                },
            },
        });
        return bill;
    }
    async findAll() {
        return this.prisma.utilityBill.findMany({
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
    async findOne(id) {
        const bill = await this.prisma.utilityBill.findUnique({
            where: { id },
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
            throw new common_1.NotFoundException(`Utility bill with ID ${id} not found`);
        }
        return bill;
    }
    async findByMonth(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        return this.prisma.utilityBill.findMany({
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
                    },
                },
            },
            orderBy: {
                billType: "asc",
            },
        });
    }
    async getMonthlySummary(year, month) {
        const bills = await this.findByMonth(year, month);
        const activeMembers = await this.prisma.user.count({
            where: { isActive: true },
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
        const activeMembers = await this.prisma.user.count({
            where: { isActive: true },
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
    async update(id, updateUtilityBillDto) {
        const existing = await this.prisma.utilityBill.findUnique({
            where: { id },
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
        return this.prisma.utilityBill.update({
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
    }
    async remove(id) {
        const bill = await this.prisma.utilityBill.findUnique({
            where: { id },
        });
        if (!bill) {
            throw new common_1.NotFoundException(`Utility bill with ID ${id} not found`);
        }
        await this.prisma.utilityBill.delete({
            where: { id },
        });
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
        return {
            message: `Deleted ${deleted.count} utility bills for ${(0, date_fns_1.format)(startDate, "MMMM yyyy")}`,
            count: deleted.count,
        };
    }
};
exports.UtilityBillsService = UtilityBillsService;
exports.UtilityBillsService = UtilityBillsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UtilityBillsService);
//# sourceMappingURL=utility-bills.service.js.map