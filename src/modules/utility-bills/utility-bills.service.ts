// src/modules/utility-bills/utility-bills.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUtilityBillDto, UpdateUtilityBillDto } from "./dto";
import { BillType } from "@prisma/client";
import { startOfDay, endOfDay, format, getMonth, getYear } from "date-fns";

@Injectable()
export class UtilityBillsService {
  constructor(private prisma: PrismaService) {}

  // ==================== CREATE ====================

  async create(createUtilityBillDto: CreateUtilityBillDto) {
    const { billType, monthYear, amount, paidBy, note } = createUtilityBillDto;

    // যদি paidBy দেওয়া থাকে, চেক করুন
    if (paidBy) {
      const user = await this.prisma.user.findUnique({
        where: { id: paidBy },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${paidBy} not found`);
      }
    }

    const monthDate = new Date(monthYear);

    // Check if bill already exists for this month and type
    const existing = await this.prisma.utilityBill.findFirst({
      where: {
        billType,
        monthYear: {
          gte: startOfDay(monthDate),
          lte: endOfDay(monthDate),
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Bill for ${billType} already exists for ${format(monthDate, "MMMM yyyy")}`,
      );
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

  // ==================== FIND ====================

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

  async findOne(id: string) {
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
      throw new NotFoundException(`Utility bill with ID ${id} not found`);
    }

    return bill;
  }

  async findByMonth(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.prisma.utilityBill.findMany({
      where: {
        monthYear: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
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

  async getMonthlySummary(year: number, month: number) {
    const bills = await this.findByMonth(year, month);

    // Get active members count
    const activeMembers = await this.prisma.user.count({
      where: { isActive: true },
    });

    const totalCurrent = bills
      .filter((b) => b.billType === BillType.CURRENT)
      .reduce((sum, b) => sum + Number(b.amount), 0);

    const totalWifi = bills
      .filter((b) => b.billType === BillType.WIFI)
      .reduce((sum, b) => sum + Number(b.amount), 0);

    const totalRent = bills
      .filter((b) => b.billType === BillType.RENT)
      .reduce((sum, b) => sum + Number(b.amount), 0);

    const totalWater = bills
      .filter((b) => b.billType === BillType.WATER)
      .reduce((sum, b) => sum + Number(b.amount), 0);

    const totalKhala = bills
      .filter((b) => b.billType === BillType.KHALA)
      .reduce((sum, b) => sum + Number(b.amount), 0);

    const totalAmount =
      totalCurrent + totalWifi + totalRent + totalWater + totalKhala;
    const perPersonShare = activeMembers > 0 ? totalAmount / activeMembers : 0;

    return {
      month: format(new Date(year, month - 1, 1), "MMMM"),
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
      .filter((b) => b.billType === BillType.CURRENT)
      .reduce((sum, b) => sum + Number(b.amount), 0);

    const totalWifi = bills
      .filter((b) => b.billType === BillType.WIFI)
      .reduce((sum, b) => sum + Number(b.amount), 0);

    const totalRent = bills
      .filter((b) => b.billType === BillType.RENT)
      .reduce((sum, b) => sum + Number(b.amount), 0);

    const totalWater = bills
      .filter((b) => b.billType === BillType.WATER)
      .reduce((sum, b) => sum + Number(b.amount), 0);

    const totalKhala = bills
      .filter((b) => b.billType === BillType.KHALA)
      .reduce((sum, b) => sum + Number(b.amount), 0);

    const totalAmount =
      totalCurrent + totalWifi + totalRent + totalWater + totalKhala;

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

  // ==================== UPDATE ====================

  async update(id: string, updateUtilityBillDto: UpdateUtilityBillDto) {
    const existing = await this.prisma.utilityBill.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Utility bill with ID ${id} not found`);
    }

    // যদি paidBy দেওয়া থাকে, চেক করুন
    if (updateUtilityBillDto.paidBy) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateUtilityBillDto.paidBy },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateUtilityBillDto.paidBy} not found`,
        );
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

  // ==================== DELETE ====================

  async remove(id: string) {
    const bill = await this.prisma.utilityBill.findUnique({
      where: { id },
    });

    if (!bill) {
      throw new NotFoundException(`Utility bill with ID ${id} not found`);
    }

    await this.prisma.utilityBill.delete({
      where: { id },
    });

    return { message: `Utility bill with ID ${id} deleted successfully` };
  }

  async removeByMonth(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const deleted = await this.prisma.utilityBill.deleteMany({
      where: {
        monthYear: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
    });

    return {
      message: `Deleted ${deleted.count} utility bills for ${format(startDate, "MMMM yyyy")}`,
      count: deleted.count,
    };
  }
}
