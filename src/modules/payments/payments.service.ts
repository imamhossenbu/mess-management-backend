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
import { NotificationsService } from "../notifications/notifications.service"; // ✅ Import

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService, // ✅ Inject
  ) {}

  // ==================== CREATE ====================

  async create(createPaymentDto: CreatePaymentDto) {
    const { userId, amount, paymentDate, paymentMethod, note } =
      createPaymentDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const date = paymentDate ? new Date(paymentDate) : new Date();

    // Create payment
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        amount,
        paymentDate: date,
        paymentMethod: paymentMethod || PaymentMethod.CASH,
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

    // Update user balance
    await this.updateUserBalance(userId);

    // ✅ Send payment confirmation to user
    await this.notificationsService.sendPaymentConfirmation(userId, amount);

    // ✅ Send notification to all admins
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "MANAGER"] },
        isActive: true,
      },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "PAYMENT",
        title: "New Payment Received",
        message: `${user.name} made a payment of ${amount} TK. Method: ${paymentMethod || "CASH"}`,
        link: `/payments/${payment.id}`,
      });
    }

    return payment;
  }

  // ==================== FIND ====================

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

  async findOne(id: string) {
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
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async findByUser(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate && endDate) {
      where.paymentDate = {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
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

  async findByDate(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

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

  async findByMonth(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
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

  async getMonthlySummary(year: number, month: number) {
    const payments = await this.findByMonth(year, month);

    const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    // ✅ Send notification if monthly payment is low
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "MANAGER"] },
        isActive: true,
      },
    });

    // Get total monthly bill for comparison
    const startDate = new Date(year, month - 1, 1);
    const monthlySummary = await this.prisma.monthlySummary.findMany({
      where: {
        monthYear: startDate,
      },
    });

    const totalBill = monthlySummary.reduce(
      (sum, s) => sum + Number(s.totalBill),
      0,
    );

    if (totalAmount < totalBill * 0.5 && totalBill > 0) {
      for (const admin of admins) {
        await this.notificationsService.create({
          userId: admin.id,
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

  async getUserBalance(userId: string) {
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
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const totalPaid = user.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );
    const balance = user.balances?.balance ? Number(user.balances.balance) : 0;

    // ✅ Send notification if user has high due
    if (balance < -5000) {
      await this.notificationsService.create({
        userId: user.id,
        type: "BILL",
        title: "High Due Alert",
        message: `You have a high due balance of ${Math.abs(balance)} TK. Please pay as soon as possible to avoid penalties.`,
        link: "/payments",
      });
    }

    return {
      userId: user.id,
      userName: user.name,
      totalPaid,
      balance, // + = পাওনা, - = বাকি
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

    const results = users.map((user) => ({
      userId: user.id,
      userName: user.name,
      phone: user.phone,
      totalPaid: user.payments.reduce((sum, p) => sum + Number(p.amount), 0),
      balance: user.balances?.balance ? Number(user.balances.balance) : 0,
    }));

    // ✅ Check for users with high due and send notifications
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

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const existing = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
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
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    // Update user balance
    await this.updateUserBalance(existing.userId);

    // ✅ Send notification for update
    const newAmount = Number(updated.amount);
    await this.notificationsService.create({
      userId: existing.userId,
      type: "PAYMENT",
      title: "Payment Updated",
      message: `Your payment has been updated from ${oldAmount} TK to ${newAmount} TK.`,
      link: `/payments/${id}`,
    });

    // ✅ Notify admins about update
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "MANAGER"] },
        isActive: true,
      },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "PAYMENT",
        title: "Payment Updated",
        message: `${existing.user.name}'s payment updated from ${oldAmount} TK to ${newAmount} TK.`,
        link: `/payments/${id}`,
      });
    }

    return updated;
  }

  // ==================== DELETE ====================

  async remove(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    const amount = Number(payment.amount);

    await this.prisma.payment.delete({
      where: { id },
    });

    // Update user balance
    await this.updateUserBalance(payment.userId);

    // ✅ Send notification for deletion
    await this.notificationsService.create({
      userId: payment.userId,
      type: "PAYMENT",
      title: "Payment Deleted",
      message: `Your payment of ${amount} TK has been deleted. Please contact admin if this was a mistake.`,
      link: "/payments",
    });

    // ✅ Notify admins about deletion
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "MANAGER"] },
        isActive: true,
      },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "PAYMENT",
        title: "Payment Deleted",
        message: `${payment.user.name}'s payment of ${amount} TK has been deleted.`,
        link: "/payments",
      });
    }

    return { message: `Payment with ID ${id} deleted successfully` };
  }

  // ==================== PRIVATE METHODS ====================

  private async updateUserBalance(userId: string) {
    // Get all payments for this user
    const payments = await this.prisma.payment.findMany({
      where: { userId },
    });

    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    // Get user's current balance
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
    } else {
      await this.prisma.userBalance.create({
        data: {
          userId,
          balance: totalPaid,
        },
      });
    }
  }
}
