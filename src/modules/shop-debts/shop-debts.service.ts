// src/modules/shop-debts/shop-debts.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateShopDebtDto, UpdateShopDebtDto } from "./dto";
import { DebtStatus } from "@prisma/client";
import { startOfDay, endOfDay, format, getMonth, getYear } from "date-fns";

@Injectable()
export class ShopDebtsService {
  constructor(private prisma: PrismaService) {}

  // ==================== CREATE ====================

  async create(createShopDebtDto: CreateShopDebtDto) {
    const { shopName, date, itemDetails, amount, status, note } =
      createShopDebtDto;

    const debtDate = date ? new Date(date) : new Date();

    const debt = await this.prisma.shopDebt.create({
      data: {
        shopName,
        date: debtDate,
        itemDetails,
        amount,
        status: status || DebtStatus.DUE,
        note,
      },
    });

    // Update monthly summary
    await this.updateMonthlySummary(debtDate);

    return debt;
  }

  // ==================== PAY ====================

  async payDebt(id: string, paidDate?: string) {
    const debt = await this.prisma.shopDebt.findUnique({
      where: { id },
    });

    if (!debt) {
      throw new NotFoundException(`Shop debt with ID ${id} not found`);
    }

    if (debt.status === DebtStatus.PAID) {
      throw new BadRequestException("This debt is already paid");
    }

    const updated = await this.prisma.shopDebt.update({
      where: { id },
      data: {
        status: DebtStatus.PAID,
        paidDate: paidDate ? new Date(paidDate) : new Date(),
      },
    });

    // Update monthly summary
    await this.updateMonthlySummary(debt.date);

    return updated;
  }

  // ==================== FIND ====================

  async findAll() {
    return this.prisma.shopDebt.findMany({
      orderBy: {
        date: "desc",
      },
    });
  }

  async findOne(id: string) {
    const debt = await this.prisma.shopDebt.findUnique({
      where: { id },
    });

    if (!debt) {
      throw new NotFoundException(`Shop debt with ID ${id} not found`);
    }

    return debt;
  }

  async findByShop(shopName: string) {
    return this.prisma.shopDebt.findMany({
      where: {
        shopName: {
          contains: shopName,
          mode: "insensitive",
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  async findByDate(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    return this.prisma.shopDebt.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
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

    return this.prisma.shopDebt.findMany({
      where: {
        date: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  async getSummary() {
    const allDebts = await this.prisma.shopDebt.findMany();

    const totalDue = allDebts
      .filter((d) => d.status === DebtStatus.DUE)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const totalPaid = allDebts
      .filter((d) => d.status === DebtStatus.PAID)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const totalAmount = allDebts.reduce((sum, d) => sum + Number(d.amount), 0);

    // Shop-wise summary
    const shopMap = new Map<
      string,
      { totalDue: number; totalPaid: number; totalAmount: number }
    >();

    allDebts.forEach((debt) => {
      const existing = shopMap.get(debt.shopName);
      if (existing) {
        existing.totalAmount += Number(debt.amount);
        if (debt.status === DebtStatus.DUE) {
          existing.totalDue += Number(debt.amount);
        } else {
          existing.totalPaid += Number(debt.amount);
        }
      } else {
        shopMap.set(debt.shopName, {
          totalAmount: Number(debt.amount),
          totalDue: debt.status === DebtStatus.DUE ? Number(debt.amount) : 0,
          totalPaid: debt.status === DebtStatus.PAID ? Number(debt.amount) : 0,
        });
      }
    });

    const shopWiseSummary = Array.from(shopMap.entries()).map(
      ([shopName, data]) => ({
        shopName,
        ...data,
      }),
    );

    return {
      totalDue,
      totalPaid,
      totalAmount,
      shopWiseSummary: shopWiseSummary.sort((a, b) => b.totalDue - a.totalDue),
    };
  }

  async getMonthlySummary(year: number, month: number) {
    const debts = await this.findByMonth(year, month);

    const totalDebt = debts
      .filter((d) => d.status === DebtStatus.DUE)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const totalPaid = debts
      .filter((d) => d.status === DebtStatus.PAID)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const currentDue = debts.reduce((sum, d) => sum + Number(d.amount), 0);

    return {
      month: format(new Date(year, month - 1, 1), "MMMM"),
      year,
      totalDebt,
      totalPaid,
      currentDue,
      debts,
    };
  }

  // ==================== UPDATE ====================

  async update(id: string, updateShopDebtDto: UpdateShopDebtDto) {
    const existing = await this.prisma.shopDebt.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Shop debt with ID ${id} not found`);
    }

    const updated = await this.prisma.shopDebt.update({
      where: { id },
      data: {
        shopName: updateShopDebtDto.shopName,
        itemDetails: updateShopDebtDto.itemDetails,
        amount: updateShopDebtDto.amount,
        status: updateShopDebtDto.status,
        paidDate: updateShopDebtDto.paidDate
          ? new Date(updateShopDebtDto.paidDate)
          : undefined,
        note: updateShopDebtDto.note,
      },
    });

    // Update monthly summary
    await this.updateMonthlySummary(existing.date);

    return updated;
  }

  // ==================== DELETE ====================

  async remove(id: string) {
    const debt = await this.prisma.shopDebt.findUnique({
      where: { id },
    });

    if (!debt) {
      throw new NotFoundException(`Shop debt with ID ${id} not found`);
    }

    await this.prisma.shopDebt.delete({
      where: { id },
    });

    // Update monthly summary
    await this.updateMonthlySummary(debt.date);

    return { message: `Shop debt with ID ${id} deleted successfully` };
  }

  // ==================== MONTHLY SUMMARY ====================

  private async updateMonthlySummary(date: Date) {
    const monthYear = new Date(date.getFullYear(), date.getMonth(), 1);
    const startDate = startOfDay(monthYear);
    const endDate = endOfDay(
      new Date(date.getFullYear(), date.getMonth() + 1, 0),
    );

    const debts = await this.prisma.shopDebt.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalDebt = debts
      .filter((d) => d.status === DebtStatus.DUE)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const totalPaid = debts
      .filter((d) => d.status === DebtStatus.PAID)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const currentDue = debts.reduce((sum, d) => sum + Number(d.amount), 0);

    const existing = await this.prisma.shopMonthlySummary.findUnique({
      where: {
        monthYear: startDate,
      },
    });

    if (existing) {
      await this.prisma.shopMonthlySummary.update({
        where: { monthYear: startDate },
        data: {
          totalDebt,
          totalPaid,
          currentDue,
        },
      });
    } else {
      await this.prisma.shopMonthlySummary.create({
        data: {
          monthYear: startDate,
          totalDebt,
          totalPaid,
          currentDue,
        },
      });
    }
  }

  // ==================== GET MONTHLY SUMMARY ====================

  async getMonthlySummaryReport(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const summary = await this.prisma.shopMonthlySummary.findUnique({
      where: {
        monthYear: startDate,
      },
    });

    if (!summary) {
      return {
        month: format(startDate, "MMMM"),
        year,
        totalDebt: 0,
        totalPaid: 0,
        currentDue: 0,
        message: "No data for this month",
      };
    }

    return {
      month: format(startDate, "MMMM"),
      year,
      totalDebt: Number(summary.totalDebt),
      totalPaid: Number(summary.totalPaid),
      currentDue: Number(summary.currentDue),
    };
  }
}
