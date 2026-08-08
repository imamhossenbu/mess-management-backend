// src/modules/utility-bills/utility-bills.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUtilityBillDto, UpdateUtilityBillDto } from "./dto";
import { BillType } from "@prisma/client";
import { startOfDay, endOfDay, format } from "date-fns";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class UtilityBillsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ==================== CREATE ====================

  async create(messId: string, createUtilityBillDto: CreateUtilityBillDto) {
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
        messId,
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
        messId,
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

    // ✅ Send notification to all users of this mess
    const members = await this.prisma.messMember.findMany({
      where: {
        messId,
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    const billTypeLabels = {
      CURRENT: "Electricity",
      WIFI: "Internet",
      RENT: "Rent",
      WATER: "Water",
      KHALA: "Cook",
    };

    for (const member of members) {
      await this.notificationsService.create({
        userId: member.userId,
        type: "BILL",
        title: `New ${billTypeLabels[billType] || billType} Bill Added`,
        message: `${format(monthDate, "MMMM yyyy")} ${billTypeLabels[billType] || billType} bill of ${amount} TK has been added.`,
        link: "/utility-bills",
      });
    }

    // ✅ Send notification to admins
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
        type: "BILL",
        title: "Utility Bill Added",
        message: `${billTypeLabels[billType] || billType} bill of ${amount} TK added for ${format(monthDate, "MMMM yyyy")}`,
        link: `/utility-bills/${bill.id}`,
      });
    }

    return bill;
  }

  // ==================== FIND ====================

  async findAll(messId: string) {
    return this.prisma.utilityBill.findMany({
      where: { messId },
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

  async findOne(messId: string, id: string) {
    const bill = await this.prisma.utilityBill.findUnique({
      where: { id, messId },
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
      throw new NotFoundException(
        `Utility bill with ID ${id} not found in this mess`,
      );
    }

    return bill;
  }

  async findByMonth(messId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.prisma.utilityBill.findMany({
      where: {
        messId,
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

  async getMonthlySummary(messId: string, year: number, month: number) {
    const bills = await this.findByMonth(messId, year, month);

    // Get active members count
    const activeMembers = await this.prisma.messMember.count({
      where: {
        messId,
        isActive: true,
      },
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

    // ✅ Send notification if total utility bill is too high
    if (totalAmount > 50000) {
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
          type: "BILL",
          title: "High Utility Bill Alert",
          message: `Total utility bill for ${format(new Date(year, month - 1, 1), "MMMM yyyy")} is ${totalAmount} TK. Please review.`,
          link: "/utility-bills",
        });
      }
    }

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

  async getSummary(messId: string) {
    const bills = await this.prisma.utilityBill.findMany({
      where: { messId },
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

    const activeMembers = await this.prisma.messMember.count({
      where: {
        messId,
        isActive: true,
      },
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

  async update(
    messId: string,
    id: string,
    updateUtilityBillDto: UpdateUtilityBillDto,
  ) {
    const existing = await this.prisma.utilityBill.findUnique({
      where: { id, messId },
      include: {
        payer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Utility bill with ID ${id} not found in this mess`,
      );
    }

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

    const updated = await this.prisma.utilityBill.update({
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

    const billTypeLabels = {
      CURRENT: "Electricity",
      WIFI: "Internet",
      RENT: "Rent",
      WATER: "Water",
      KHALA: "Cook",
    };

    const members = await this.prisma.messMember.findMany({
      where: {
        messId,
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    for (const member of members) {
      await this.notificationsService.create({
        userId: member.userId,
        type: "BILL",
        title: `Utility Bill Updated`,
        message: `${billTypeLabels[existing.billType] || existing.billType} bill for ${format(existing.monthYear, "MMMM yyyy")} has been updated to ${updated.amount} TK.`,
        link: "/utility-bills",
      });
    }

    return updated;
  }

  // ==================== DELETE ====================

  async remove(messId: string, id: string) {
    const bill = await this.prisma.utilityBill.findUnique({
      where: { id, messId },
      include: {
        payer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!bill) {
      throw new NotFoundException(
        `Utility bill with ID ${id} not found in this mess`,
      );
    }

    await this.prisma.utilityBill.delete({
      where: { id },
    });

    const billTypeLabels = {
      CURRENT: "Electricity",
      WIFI: "Internet",
      RENT: "Rent",
      WATER: "Water",
      KHALA: "Cook",
    };

    const members = await this.prisma.messMember.findMany({
      where: {
        messId,
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    for (const member of members) {
      await this.notificationsService.create({
        userId: member.userId,
        type: "BILL",
        title: `Utility Bill Deleted`,
        message: `${billTypeLabels[bill.billType] || bill.billType} bill for ${format(bill.monthYear, "MMMM yyyy")} has been deleted.`,
        link: "/utility-bills",
      });
    }

    return { message: `Utility bill with ID ${id} deleted successfully` };
  }

  async removeByMonth(messId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const deleted = await this.prisma.utilityBill.deleteMany({
      where: {
        messId,
        monthYear: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
    });

    if (deleted.count > 0) {
      const members = await this.prisma.messMember.findMany({
        where: {
          messId,
          isActive: true,
        },
        include: {
          user: true,
        },
      });

      for (const member of members) {
        await this.notificationsService.create({
          userId: member.userId,
          type: "BILL",
          title: `Utility Bills Deleted`,
          message: `${deleted.count} utility bills for ${format(startDate, "MMMM yyyy")} have been deleted.`,
          link: "/utility-bills",
        });
      }
    }

    return {
      message: `Deleted ${deleted.count} utility bills for ${format(startDate, "MMMM yyyy")}`,
      count: deleted.count,
    };
  }
}
