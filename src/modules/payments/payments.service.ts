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

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

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

    return users.map((user) => ({
      userId: user.id,
      userName: user.name,
      phone: user.phone,
      totalPaid: user.payments.reduce((sum, p) => sum + Number(p.amount), 0),
      balance: user.balances?.balance ? Number(user.balances.balance) : 0,
    }));
  }

  // ==================== UPDATE ====================

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const existing = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
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

    // Update user balance
    await this.updateUserBalance(existing.userId);

    return updated;
  }

  // ==================== DELETE ====================

  async remove(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    await this.prisma.payment.delete({
      where: { id },
    });

    // Update user balance
    await this.updateUserBalance(payment.userId);

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
