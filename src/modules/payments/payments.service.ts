// src/modules/payments/payments.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePaymentDto, UpdatePaymentDto } from "./dto";
import { PaymentMethod } from "@prisma/client";
import { startOfDay, endOfDay, format } from "date-fns";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ==================== CREATE ====================

  async create(messId: string, createPaymentDto: CreatePaymentDto) {
    const { userId, amount, paymentDate, paymentMethod, note } =
      createPaymentDto;

    // Check if member exists in this mess
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
      throw new NotFoundException(`User is not a member of this mess`);
    }

    const date = paymentDate ? new Date(paymentDate) : new Date();

    // Create payment
    const payment = await this.prisma.payment.create({
      data: {
        messId,
        memberId: member.id,
        amount,
        paymentDate: date,
        paymentMethod: paymentMethod || PaymentMethod.CASH,
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

    // Update user balance
    await this.updateUserBalance(messId, member.id);

    // ✅ Send payment confirmation to user
    await this.notificationsService.sendPaymentConfirmation(userId, amount);

    // ✅ Send notification to all admins of this mess
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

  // ==================== FIND ====================

  async findAll(messId: string) {
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

  async findOne(messId: string, id: string) {
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
      throw new NotFoundException(
        `Payment with ID ${id} not found in this mess`,
      );
    }

    return payment;
  }

  async findByUser(
    messId: string,
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const member = await this.prisma.messMember.findFirst({
      where: {
        userId,
        messId,
        isActive: true,
      },
    });

    if (!member) {
      throw new NotFoundException(`User is not a member of this mess`);
    }

    const where: any = { messId, memberId: member.id };

    if (startDate && endDate) {
      where.paymentDate = {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
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

  async findByDate(messId: string, date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

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

  async findByMonth(messId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.prisma.payment.findMany({
      where: {
        messId,
        paymentDate: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
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

  async getMonthlySummary(messId: string, year: number, month: number) {
    const payments = await this.findByMonth(messId, year, month);

    const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    // Get total monthly bill for comparison
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const monthlySummary = await this.prisma.monthlySummary.findMany({
      where: {
        messId,
        monthYear: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
    });

    const totalBill = monthlySummary.reduce(
      (sum, s) => sum + Number(s.totalBill),
      0,
    );

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
          message: `Total payments for ${format(startDate, "MMMM yyyy")} is ${totalAmount} TK, which is less than 50% of total bill (${totalBill} TK).`,
          link: "/payments",
        });
      }
    }

    return {
      month: format(new Date(year, month - 1, 1), "MMMM"),
      year,
      totalPayments: payments.length,
      totalAmount,
      payments,
    };
  }

  // ==================== USER BALANCE ====================

  async getUserBalance(messId: string, userId: string) {
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
      throw new NotFoundException(`User is not a member of this mess`);
    }

    const totalPaid = member.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );
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

  async getAllUserBalances(messId: string) {
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

  // ==================== UPDATE ====================

  async update(messId: string, id: string, updatePaymentDto: UpdatePaymentDto) {
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
      throw new NotFoundException(
        `Payment with ID ${id} not found in this mess`,
      );
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

  // ==================== DELETE ====================

  async remove(messId: string, id: string) {
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
      throw new NotFoundException(
        `Payment with ID ${id} not found in this mess`,
      );
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

  // ==================== PRIVATE METHODS ====================

  private async updateUserBalance(messId: string, memberId: string) {
    // Get all payments for this member
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
    } else {
      await this.prisma.userBalance.create({
        data: {
          memberId,
          balance: totalPaid,
        },
      });
    }
  }
}
