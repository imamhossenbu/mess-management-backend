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
import { DashboardService } from "../dashboard/dashboard.service";

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private dashboardService: DashboardService
  ) {}

  // ==================== CREATE ====================

  async create(createPaymentDto: CreatePaymentDto) {
    const { userId, amount, paymentDate, paymentMethod, note } =
      createPaymentDto;

    // Check if user exists and is active
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(`User not found or inactive`);
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
            email: true,
          },
        },
      },
    });

    // Update user balance
    await this.updateUserBalance(userId);

    // Send payment confirmation to user
    await this.notificationsService.sendPaymentConfirmation(userId, amount, date);

    // Send notification to all admins
    const admins = await this.prisma.user.findMany({
      where: {
        role: "ADMIN",
        isActive: true,
      },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "PAYMENT",
        title: "New Payment Received",
        message: `${user.name} made a payment of ${amount} TK for ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}. Method: ${paymentMethod || "CASH"}`,
        link: `/payments/${payment.id}`,
      });
    }

    return {
      ...payment,
      userName: payment.user?.name || "Unknown",
    };
  }

  // ==================== FIND ====================

  async findAll() {
    const payments = await this.prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        paymentDate: "desc",
      },
    });

    return payments.map((p) => ({
      ...p,
      userName: p.user?.name || "Unknown",
    }));
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
            email: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return {
      ...payment,
      userName: payment.user?.name || "Unknown",
    };
  }

  async findByUser(userId: string, startDate?: Date, endDate?: Date) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const where: any = { userId };

    if (startDate && endDate) {
      where.paymentDate = {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      };
    }

    const payments = await this.prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        paymentDate: "desc",
      },
    });

    return payments.map((p) => ({
      ...p,
      userName: p.user?.name || "Unknown",
    }));
  }

  async findByDate(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const payments = await this.prisma.payment.findMany({
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
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return payments.map((p) => ({
      ...p,
      userName: p.user?.name || "Unknown",
    }));
  }

  async findByMonth(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const payments = await this.prisma.payment.findMany({
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
            email: true,
          },
        },
      },
      orderBy: {
        paymentDate: "desc",
      },
    });

    return payments.map((p) => ({
      ...p,
      userName: p.user?.name || "Unknown",
    }));
  }

  async getMonthlySummary(year: number, month: number) {
    const payments = await this.findByMonth(year, month);
    const startDate = new Date(year, month - 1, 1);

    const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    // Get total monthly bill for comparison
    const endDate = new Date(year, month, 0);
    const monthlySummary = await this.prisma.monthlySummary.findMany({
      where: {
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

    // Low payment alert
    if (totalAmount < totalBill * 0.5 && totalBill > 0) {
      const admins = await this.prisma.user.findMany({
        where: {
          role: "ADMIN",
          isActive: true,
        },
      });

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
      month: format(startDate, "MMMM"),
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
        userBalance: true,
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

    const currentMonthBalances = await this.dashboardService.getMemberBalances();
    const liveBalanceData = currentMonthBalances.find(b => b.userId === userId);
    const balance = liveBalanceData?.balance || 0;
    const totalPaid = liveBalanceData?.totalPaid || 0;

    // High due alert
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
      balance,
      payments: user.payments.map((p) => ({
        ...p,
        amount: Number(p.amount),
      })),
    };
  }

  async getAllUserBalances() {
    const results = await this.dashboardService.getMemberBalances();

    // High due alerts
    for (const user of results) {
      if (user.balance < -5000) {
        await this.notificationsService.create({
          userId: user.userId,
          type: "BILL",
          title: "High Due Alert",
          message: `Your balance is Tk ${Math.abs(user.balance)}. Please clear your dues.`,
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
            email: true,
          },
        },
      },
    });

    // Update user balance
    await this.updateUserBalance(existing.userId);

    const newAmount = Number(updated.amount);
    await this.notificationsService.create({
      userId: existing.userId,
      type: "PAYMENT",
      title: "Payment Updated",
      message: `Your payment has been updated from ${oldAmount} TK to ${newAmount} TK.`,
      link: `/payments/${id}`,
    });

    // Notify admins
    const admins = await this.prisma.user.findMany({
      where: {
        role: "ADMIN",
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

    return {
      ...updated,
      userName: updated.user?.name || "Unknown",
    };
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
    const userId = payment.userId;

    await this.prisma.payment.delete({
      where: { id },
    });

    // Update user balance
    await this.updateUserBalance(userId);

    await this.notificationsService.create({
      userId: payment.userId,
      type: "PAYMENT",
      title: "Payment Deleted",
      message: `Your payment of ${amount} TK has been deleted. Please contact admin if this was a mistake.`,
      link: "/payments",
    });

    // Notify admins
    const admins = await this.prisma.user.findMany({
      where: {
        role: "ADMIN",
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
    // 1. Get all payments for this user (Total Paid)
    const payments = await this.prisma.payment.findMany({
      where: { userId },
    });
    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    // 2. Get all monthly summaries for this user (Total Billed)
    const summaries = await this.prisma.monthlySummary.findMany({
      where: { userId },
    });
    const totalBilled = summaries.reduce((sum, s) => sum + Number(s.totalBill), 0);

    // 3. Balance = Total Paid - Total Billed
    const newBalance = totalPaid - totalBilled;

    const userBalance = await this.prisma.userBalance.findUnique({
      where: { userId },
    });

    if (userBalance) {
      await this.prisma.userBalance.update({
        where: { userId },
        data: {
          balance: newBalance,
          lastUpdated: new Date(),
        },
      });
    } else {
      await this.prisma.userBalance.create({
        data: {
          userId,
          balance: newBalance,
        },
      });
    }
  }
}
