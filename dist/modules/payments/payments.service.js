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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPaymentDto) {
        const { userId, amount, paymentDate, paymentMethod, note } = createPaymentDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const date = paymentDate ? new Date(paymentDate) : new Date();
        const payment = await this.prisma.payment.create({
            data: {
                userId,
                amount,
                paymentDate: date,
                paymentMethod: paymentMethod || client_1.PaymentMethod.CASH,
                note,
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
        await this.updateUserBalance(userId);
        return payment;
    }
    async findAll() {
        return this.prisma.payment.findMany({
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
                paymentDate: "desc",
            },
        });
    }
    async findOne(id) {
        const payment = await this.prisma.payment.findUnique({
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
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        return payment;
    }
    async findByUser(userId, startDate, endDate) {
        const where = { userId };
        if (startDate && endDate) {
            where.paymentDate = {
                gte: (0, date_fns_1.startOfDay)(startDate),
                lte: (0, date_fns_1.endOfDay)(endDate),
            };
        }
        return this.prisma.payment.findMany({
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
                paymentDate: "desc",
            },
        });
    }
    async findByDate(date) {
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
        return this.prisma.payment.findMany({
            where: {
                paymentDate: {
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
    async findByMonth(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        return this.prisma.payment.findMany({
            where: {
                paymentDate: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
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
                paymentDate: "desc",
            },
        });
    }
    async getMonthlySummary(year, month) {
        const payments = await this.findByMonth(year, month);
        const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        return {
            month: (0, date_fns_1.format)(new Date(year, month - 1, 1), "MMMM"),
            year,
            totalPayments: payments.length,
            totalAmount,
            payments,
        };
    }
    async getUserBalance(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                balances: true,
                payments: {
                    orderBy: {
                        paymentDate: "desc",
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const totalPaid = user.payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const balance = user.balances?.balance ? Number(user.balances.balance) : 0;
        return {
            userId: user.id,
            userName: user.name,
            totalPaid,
            balance,
            payments: user.payments,
        };
    }
    async getAllUserBalances() {
        const users = await this.prisma.user.findMany({
            where: { isActive: true },
            include: {
                balances: true,
                payments: {
                    orderBy: {
                        paymentDate: "desc",
                    },
                },
            },
        });
        return users.map((user) => ({
            userId: user.id,
            userName: user.name,
            phone: user.phone,
            totalPaid: user.payments.reduce((sum, p) => sum + Number(p.amount), 0),
            balance: user.balances?.balance ? Number(user.balances.balance) : 0,
        }));
    }
    async update(id, updatePaymentDto) {
        const existing = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        const updated = await this.prisma.payment.update({
            where: { id },
            data: {
                amount: updatePaymentDto.amount,
                paymentDate: updatePaymentDto.paymentDate
                    ? new Date(updatePaymentDto.paymentDate)
                    : undefined,
                paymentMethod: updatePaymentDto.paymentMethod,
                note: updatePaymentDto.note,
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
        await this.updateUserBalance(existing.userId);
        return updated;
    }
    async remove(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        await this.prisma.payment.delete({
            where: { id },
        });
        await this.updateUserBalance(payment.userId);
        return { message: `Payment with ID ${id} deleted successfully` };
    }
    async updateUserBalance(userId) {
        const payments = await this.prisma.payment.findMany({
            where: { userId },
        });
        const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const userBalance = await this.prisma.userBalance.findUnique({
            where: { userId },
        });
        if (userBalance) {
            await this.prisma.userBalance.update({
                where: { userId },
                data: {
                    balance: totalPaid,
                    lastUpdated: new Date(),
                },
            });
        }
        else {
            await this.prisma.userBalance.create({
                data: {
                    userId,
                    balance: totalPaid,
                },
            });
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map