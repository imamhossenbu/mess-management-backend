// src/modules/shop-debts/shop-debts.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateShopDebtDto, UpdateShopDebtDto } from "./dto";
import { CreateShopPaymentDto } from "./dto/create-shop-payment.dto";
import { format } from "date-fns";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class ShopDebtsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ==================== CREATE DEBT ====================

  async createDebt(createShopDebtDto: CreateShopDebtDto, userId: string) {
    const { shopName, date, itemDetails, amount, note } = createShopDebtDto;
    const debtDate = date ? new Date(date) : new Date();

    const debt = await this.prisma.shopDebt.create({
      data: {
        shopName: shopName || "Local Shop",
        date: debtDate,
        itemDetails,
        amount,
        note,
        recordedById: userId,
      },
      include: {
        recordedBy: {
          select: { name: true }
        }
      }
    });

    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "SYSTEM",
        title: "New Shop Debt Added",
        message: `${debt.shopName}: ${amount} TK debt added by ${debt.recordedBy?.name || 'Unknown'}`,
        link: `/shop-debts`,
      });
    }

    return debt;
  }

  // ==================== CREATE PAYMENT ====================

  async createPayment(createShopPaymentDto: CreateShopPaymentDto, userId: string) {
    const { shopName, date, amount, note } = createShopPaymentDto;
    const paymentDate = date ? new Date(date) : new Date();

    const payment = await this.prisma.shopPayment.create({
      data: {
        shopName: shopName || "Local Shop",
        date: paymentDate,
        amount,
        note,
        paidById: userId,
      },
      include: {
        paidBy: {
          select: { name: true }
        }
      }
    });

    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "SYSTEM",
        title: "Shop Debt Paid",
        message: `${payment.shopName}: ${amount} TK paid by ${payment.paidBy?.name || 'Unknown'}`,
        link: `/shop-debts`,
      });
    }

    return payment;
  }

  // ==================== GET SUMMARY ====================

  async getSummary() {
    const allDebts = await this.prisma.shopDebt.findMany();
    const allPayments = await this.prisma.shopPayment.findMany();

    const totalDebt = allDebts.reduce((sum, d) => sum + Number(d.amount), 0);
    const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const currentDue = totalDebt - totalPaid;

    const shopMap = new Map<
      string,
      { totalDebt: number; totalPaid: number; currentDue: number }
    >();

    allDebts.forEach((debt) => {
      const existing = shopMap.get(debt.shopName) || { totalDebt: 0, totalPaid: 0, currentDue: 0 };
      existing.totalDebt += Number(debt.amount);
      existing.currentDue += Number(debt.amount);
      shopMap.set(debt.shopName, existing);
    });

    allPayments.forEach((payment) => {
      const existing = shopMap.get(payment.shopName) || { totalDebt: 0, totalPaid: 0, currentDue: 0 };
      existing.totalPaid += Number(payment.amount);
      existing.currentDue -= Number(payment.amount);
      shopMap.set(payment.shopName, existing);
    });

    const shopWiseSummary = Array.from(shopMap.entries()).map(
      ([shopName, data]) => ({
        shopName,
        ...data,
      }),
    );

    return {
      totalDebt,
      totalPaid,
      currentDue,
      shopWiseSummary: shopWiseSummary.sort((a, b) => b.currentDue - a.currentDue),
    };
  }

  // ==================== GET MONTHLY DATA ====================

  async getMonthlyData(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const debts = await this.prisma.shopDebt.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        recordedBy: {
          select: { name: true }
        }
      },
      orderBy: { date: "desc" },
    });

    const payments = await this.prisma.shopPayment.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        paidBy: {
          select: { name: true }
        }
      },
      orderBy: { date: "desc" },
    });

    return {
      month: format(startDate, "MMMM"),
      year,
      debts: debts.map(d => ({
        ...d,
        amount: Number(d.amount),
        recordedByName: d.recordedBy?.name || "Unknown"
      })),
      payments: payments.map(p => ({
        ...p,
        amount: Number(p.amount),
        paidByName: p.paidBy?.name || "Unknown"
      })),
    };
  }

  // ==================== UPDATE & DELETE (DEBTS) ====================

  async updateDebt(id: string, updateShopDebtDto: UpdateShopDebtDto) {
    const existing = await this.prisma.shopDebt.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Shop debt with ID ${id} not found`);

    return this.prisma.shopDebt.update({
      where: { id },
      data: {
        shopName: updateShopDebtDto.shopName,
        itemDetails: updateShopDebtDto.itemDetails,
        amount: updateShopDebtDto.amount,
        note: updateShopDebtDto.note,
        date: updateShopDebtDto.date ? new Date(updateShopDebtDto.date) : undefined,
      },
    });
  }

  async removeDebt(id: string) {
    const existing = await this.prisma.shopDebt.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Shop debt with ID ${id} not found`);

    await this.prisma.shopDebt.delete({ where: { id } });
    return { message: "Debt deleted successfully" };
  }

  // ==================== UPDATE & DELETE (PAYMENTS) ====================

  async updatePayment(id: string, updateShopPaymentDto: any) {
    const existing = await this.prisma.shopPayment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Shop payment with ID ${id} not found`);

    return this.prisma.shopPayment.update({
      where: { id },
      data: {
        shopName: updateShopPaymentDto.shopName,
        amount: updateShopPaymentDto.amount,
        note: updateShopPaymentDto.note,
        date: updateShopPaymentDto.date ? new Date(updateShopPaymentDto.date) : undefined,
      },
    });
  }

  async removePayment(id: string) {
    const existing = await this.prisma.shopPayment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Shop payment with ID ${id} not found`);

    await this.prisma.shopPayment.delete({ where: { id } });
    return { message: "Payment deleted successfully" };
  }
}
