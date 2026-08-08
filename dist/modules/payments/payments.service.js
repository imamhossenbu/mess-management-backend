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
const notifications_service_1 = require("../notifications/notifications.service");
let PaymentsService = class PaymentsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(messId, createPaymentDto) {
        const { userId, amount, paymentDate, paymentMethod, note } = createPaymentDto;
        const member = await this.prisma.messMember.findFirst({
            where: {
                userId,
                messId,
                isActive: true,
            },
            include: {
                user: true,
            },
        });
        if (!member) {
            throw new common_1.NotFoundException(`User is not a member of this mess`);
        }
        const date = paymentDate ? new Date(paymentDate) : new Date();
        const payment = await this.prisma.payment.create({
            data: {
                messId,
                memberId: member.id,
                amount,
                paymentDate: date,
                paymentMethod: paymentMethod || client_1.PaymentMethod.CASH,
                note,
            },
            include: {
                member: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
        await this.updateUserBalance(messId, member.id);
        await this.notificationsService.sendPaymentConfirmation(userId, amount);
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
                type: "PAYMENT",
                title: "New Payment Received",
                message: `${member.user.name} made a payment of ${amount} TK. Method: ${paymentMethod || "CASH"}`,
                link: `/payments/${payment.id}`,
            });
        }
        return payment;
    }
    async findAll(messId) {
        return this.prisma.payment.findMany({
            where: { messId },
            include: {
                member: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                paymentDate: "desc",
            },
        });
    }
    async findOne(messId, id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id, messId },
            include: {
                member: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found in this mess`);
        }
        return payment;
    }
    async findByUser(messId, userId, startDate, endDate) {
        const member = await this.prisma.messMember.findFirst({
            where: {
                userId,
                messId,
                isActive: true,
            },
        });
        if (!member) {
            throw new common_1.NotFoundException(`User is not a member of this mess`);
        }
        const where = { messId, memberId: member.id };
        if (startDate && endDate) {
            where.paymentDate = {
                gte: (0, date_fns_1.startOfDay)(startDate),
                lte: (0, date_fns_1.endOfDay)(endDate),
            };
        }
        return this.prisma.payment.findMany({
            where,
            include: {
                member: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                paymentDate: "desc",
            },
        });
    }
    async findByDate(messId, date) {
        const start = (0, date_fns_1.startOfDay)(date);
        const end = (0, date_fns_1.endOfDay)(date);
        return this.prisma.payment.findMany({
            where: {
                messId,
                paymentDate: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                member: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                phone: true,
                            },
                        },
                    },
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
        return this.prisma.payment.findMany({
            where: {
                messId,
                paymentDate: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
            include: {
                member: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                paymentDate: "desc",
            },
        });
    }
    async getMonthlySummary(messId, year, month) {
        const payments = await this.findByMonth(messId, year, month);
        const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const monthlySummary = await this.prisma.monthlySummary.findMany({
            where: {
                messId,
                monthYear: {
                    gte: (0, date_fns_1.startOfDay)(startDate),
                    lte: (0, date_fns_1.endOfDay)(endDate),
                },
            },
        });
        const totalBill = monthlySummary.reduce((sum, s) => sum + Number(s.totalBill), 0);
        if (totalAmount < totalBill * 0.5 && totalBill > 0) {
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
                    type: "PAYMENT",
                    title: "Low Payment Alert",
                    message: `Total payments for ${(0, date_fns_1.format)(startDate, "MMMM yyyy")} is ${totalAmount} TK, which is less than 50% of total bill (${totalBill} TK).`,
                    link: "/payments",
                });
            }
        }
        return {
            month: (0, date_fns_1.format)(new Date(year, month - 1, 1), "MMMM"),
            year,
            totalPayments: payments.length,
            totalAmount,
            payments,
        };
    }
    async getUserBalance(messId, userId) {
        const member = await this.prisma.messMember.findFirst({
            where: {
                userId,
                messId,
                isActive: true,
            },
            include: {
                user: true,
                userBalance: true,
                payments: {
                    orderBy: {
                        paymentDate: "desc",
                    },
                },
            },
        });
        if (!member) {
            throw new common_1.NotFoundException(`User is not a member of this mess`);
        }
        const totalPaid = member.payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const balance = member.userBalance?.balance
            ? Number(member.userBalance.balance)
            : 0;
        if (balance < -5000) {
            await this.notificationsService.create({
                userId: member.userId,
                type: "BILL",
                title: "High Due Alert",
                message: `You have a high due balance of ${Math.abs(balance)} TK. Please pay as soon as possible to avoid penalties.`,
                link: "/payments",
            });
        }
        return {
            userId: member.userId,
            userName: member.user.name,
            totalPaid,
            balance,
            payments: member.payments,
        };
    }
    async getAllUserBalances(messId) {
        const members = await this.prisma.messMember.findMany({
            where: {
                messId,
                isActive: true,
            },
            include: {
                user: true,
                userBalance: true,
                payments: {
                    orderBy: {
                        paymentDate: "desc",
                    },
                },
            },
        });
        const results = members.map((member) => ({
            userId: member.userId,
            userName: member.user.name,
            phone: member.user.phone || "",
            totalPaid: member.payments.reduce((sum, p) => sum + Number(p.amount), 0),
            balance: member.userBalance?.balance
                ? Number(member.userBalance.balance)
                : 0,
        }));
        for (const user of results) {
            if (user.balance < -5000) {
                await this.notificationsService.create({
                    userId: user.userId,
                    type: "BILL",
                    title: "High Due Alert",
                    message: `You have a high due balance of ${Math.abs(user.balance)} TK. Please pay as soon as possible.`,
                    link: "/payments",
                });
            }
        }
        return results;
    }
    async update(messId, id, updatePaymentDto) {
        const existing = await this.prisma.payment.findUnique({
            where: { id, messId },
            include: {
                member: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found in this mess`);
        }
        const oldAmount = Number(existing.amount);
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
                member: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
        await this.updateUserBalance(messId, existing.memberId);
        const newAmount = Number(updated.amount);
        await this.notificationsService.create({
            userId: existing.member.userId,
            type: "PAYMENT",
            title: "Payment Updated",
            message: `Your payment has been updated from ${oldAmount} TK to ${newAmount} TK.`,
            link: `/payments/${id}`,
        });
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
                type: "PAYMENT",
                title: "Payment Updated",
                message: `${existing.member.user.name}'s payment updated from ${oldAmount} TK to ${newAmount} TK.`,
                link: `/payments/${id}`,
            });
        }
        return updated;
    }
    async remove(messId, id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id, messId },
            include: {
                member: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found in this mess`);
        }
        const amount = Number(payment.amount);
        await this.prisma.payment.delete({
            where: { id },
        });
        await this.updateUserBalance(messId, payment.memberId);
        await this.notificationsService.create({
            userId: payment.member.userId,
            type: "PAYMENT",
            title: "Payment Deleted",
            message: `Your payment of ${amount} TK has been deleted. Please contact admin if this was a mistake.`,
            link: "/payments",
        });
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
                type: "PAYMENT",
                title: "Payment Deleted",
                message: `${payment.member.user.name}'s payment of ${amount} TK has been deleted.`,
                link: "/payments",
            });
        }
        return { message: `Payment with ID ${id} deleted successfully` };
    }
    async updateUserBalance(messId, memberId) {
        const payments = await this.prisma.payment.findMany({
            where: { messId, memberId },
        });
        const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const userBalance = await this.prisma.userBalance.findUnique({
            where: { memberId },
        });
        if (userBalance) {
            await this.prisma.userBalance.update({
                where: { memberId },
                data: {
                    balance: totalPaid,
                    lastUpdated: new Date(),
                },
            });
        }
        else {
            await this.prisma.userBalance.create({
                data: {
                    memberId,
                    balance: totalPaid,
                },
            });
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map