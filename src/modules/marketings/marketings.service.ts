// src/modules/marketings/marketings.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateMarketingDto, UpdateMarketingDto } from "./dto";
import { PaymentType, InventoryType } from "@prisma/client";
import { startOfDay, endOfDay, format } from "date-fns";
import { InventoryService } from "../inventory/inventory.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class MarketingsService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
    private notificationsService: NotificationsService,
  ) {}

  // ==================== CREATE ====================

  async create(messId: string, userId: string, createMarketingDto: CreateMarketingDto) {
    // Check if member exists in this mess
    const member = await this.prisma.messMember.findFirst({
      where: {
        userId,
        messId: messId,
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    if (!member) {
      throw new NotFoundException(`User is not a member of this mess`);
    }

    const date = createMarketingDto.date
      ? new Date(createMarketingDto.date)
      : new Date();

    // 1. Create Marketing Entry
    const marketing = await this.prisma.marketing.create({
      data: {
        messId,
        memberId: member.id,
        date: date,
        itemName: createMarketingDto.itemName,
        quantity: createMarketingDto.quantity,
        amount: createMarketingDto.amount,
        paymentType: createMarketingDto.paymentType || PaymentType.CASH,
        shopName: createMarketingDto.shopName,
        note: createMarketingDto.note,
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

    // 2. যদি ইনভেন্টরি টাইপ এবং পিস দেওয়া থাকে, তাহলে Inventory Update
    if (createMarketingDto.inventoryType && createMarketingDto.totalPieces) {
      const inventoryType = createMarketingDto.inventoryType as InventoryType;

      // ২.১: ইনভেন্টরিতে যোগ করুন (মোট পিস)
      await this.inventoryService.addInventory(messId, {
        type: inventoryType,
        quantity: createMarketingDto.totalPieces,
        marketingId: marketing.id,
        note: `বাজার থেকে ${createMarketingDto.totalPieces} পিস ${createMarketingDto.itemName} কেনা হয়েছে`,
      });

      // ২.২: যদি আজকে ব্যবহার করা হয়, তাহলে বিয়োগ করুন
      if (createMarketingDto.usedPieces && createMarketingDto.usedPieces > 0) {
        await this.inventoryService.removeInventory(messId, {
          type: inventoryType,
          quantity: createMarketingDto.usedPieces,
          note: `আজকের রান্নায় ${createMarketingDto.usedPieces} পিস ${createMarketingDto.itemName} ব্যবহার করা হয়েছে`,
        });
      }
    }

    // 3. Daily Summary Update
    await this.updateDailySummary(messId, date);

    // ✅ Send notification to user who created the marketing
    await this.notificationsService.create({
      userId,
      type: "SYSTEM",
      title: "Bazar Entry Added",
      message: `You have added a bazar entry: ${createMarketingDto.itemName} (${createMarketingDto.quantity}) - ${createMarketingDto.amount} TK`,
      link: "/marketings",
    });

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
        type: "SYSTEM",
        title: "New Bazar Entry",
        message: `${member.user.name} added bazar: ${createMarketingDto.itemName} (${createMarketingDto.quantity}) - ${createMarketingDto.amount} TK`,
        link: `/marketings/${marketing.id}`,
      });
    }

    return marketing;
  }

  // ==================== FIND ====================

  async findAll(messId: string) {
    return this.prisma.marketing.findMany({
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
        date: "desc",
      },
    });
  }

  async findOne(messId: string, id: string) {
    const marketing = await this.prisma.marketing.findUnique({
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

    if (!marketing) {
      throw new NotFoundException(
        `Marketing with ID ${id} not found in this mess`,
      );
    }

    return marketing;
  }

  async findByUser(
    messId: string,
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    // Get member in this mess
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
      where.date = {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      };
    }

    return this.prisma.marketing.findMany({
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
        date: "desc",
      },
    });
  }

  async findByDate(messId: string, date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    return this.prisma.marketing.findMany({
      where: {
        messId,
        date: {
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

  async getDailySummary(messId: string, date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const items = await this.prisma.marketing.findMany({
      where: {
        messId,
        date: {
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

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.amount),
      0,
    );
    const totalCash = items
      .filter((item) => item.paymentType === PaymentType.CASH)
      .reduce((sum, item) => sum + Number(item.amount), 0);
    const totalDebt = items
      .filter((item) => item.paymentType === PaymentType.DEBT)
      .reduce((sum, item) => sum + Number(item.amount), 0);
    const totalSelf = items
      .filter((item) => item.paymentType === PaymentType.SELF)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    // ✅ Send notification if daily total is too high
    if (totalAmount > 10000) {
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
          type: "SYSTEM",
          title: "High Bazar Spending Alert",
          message: `Total bazar cost for today is ${totalAmount} TK. Please review.`,
          link: "/marketings",
        });
      }
    }

    return {
      date: format(date, "yyyy-MM-dd"),
      totalAmount,
      totalCash,
      totalDebt,
      totalSelf,
      totalItems: items.length,
      items,
    };
  }

  async getMonthlySummary(messId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const items = await this.prisma.marketing.findMany({
      where: {
        messId,
        date: {
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
              },
            },
          },
        },
      },
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.amount),
      0,
    );
    const totalCash = items
      .filter((item) => item.paymentType === PaymentType.CASH)
      .reduce((sum, item) => sum + Number(item.amount), 0);
    const totalDebt = items
      .filter((item) => item.paymentType === PaymentType.DEBT)
      .reduce((sum, item) => sum + Number(item.amount), 0);
    const totalSelf = items
      .filter((item) => item.paymentType === PaymentType.SELF)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const categoryMap = new Map<
      string,
      { totalAmount: number; count: number }
    >();
    items.forEach((item) => {
      const existing = categoryMap.get(item.itemName);
      if (existing) {
        existing.totalAmount += Number(item.amount);
        existing.count += 1;
      } else {
        categoryMap.set(item.itemName, {
          totalAmount: Number(item.amount),
          count: 1,
        });
      }
    });

    const categorySummary = Array.from(categoryMap.entries()).map(
      ([itemName, data]) => ({
        itemName,
        totalAmount: data.totalAmount,
        count: data.count,
      }),
    );

    // ✅ Send notification if monthly total is too high
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
          type: "SYSTEM",
          title: "High Monthly Bazar Spending",
          message: `Total bazar cost for ${format(startDate, "MMMM yyyy")} is ${totalAmount} TK. Please review.`,
          link: "/marketings/monthly",
        });
      }
    }

    return {
      month: format(new Date(year, month - 1, 1), "MMMM"),
      year,
      totalAmount,
      totalCash,
      totalDebt,
      totalSelf,
      totalItems: items.length,
      categorySummary: categorySummary.sort(
        (a, b) => b.totalAmount - a.totalAmount,
      ),
    };
  }

  // ==================== UPDATE ====================

  async update(
    messId: string,
    id: string,
    updateMarketingDto: UpdateMarketingDto,
  ) {
    const existing = await this.prisma.marketing.findUnique({
      where: { id, messId },
    });

    if (!existing) {
      throw new NotFoundException(
        `Marketing with ID ${id} not found in this mess`,
      );
    }

    if (updateMarketingDto.userId) {
      const member = await this.prisma.messMember.findFirst({
        where: {
          userId: updateMarketingDto.userId,
          messId,
          isActive: true,
        },
      });
      if (!member) {
        throw new NotFoundException(`User is not a member of this mess`);
      }
    }

    const updated = await this.prisma.marketing.update({
      where: { id },
      data: {
        memberId: updateMarketingDto.userId ? undefined : existing.memberId,
        itemName: updateMarketingDto.itemName,
        quantity: updateMarketingDto.quantity,
        amount: updateMarketingDto.amount,
        paymentType: updateMarketingDto.paymentType,
        shopName: updateMarketingDto.shopName,
        note: updateMarketingDto.note,
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

    // ✅ Send notification for update
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
        type: "SYSTEM",
        title: "Bazar Entry Updated",
        message: `Bazar entry ${existing.itemName} has been updated`,
        link: `/marketings/${id}`,
      });
    }

    return updated;
  }

  // ==================== DELETE ====================

  async remove(messId: string, id: string) {
    const marketing = await this.prisma.marketing.findUnique({
      where: { id, messId },
    });

    if (!marketing) {
      throw new NotFoundException(
        `Marketing with ID ${id} not found in this mess`,
      );
    }

    await this.prisma.marketing.delete({
      where: { id },
    });

    // ✅ Send notification for deletion
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
        type: "SYSTEM",
        title: "Bazar Entry Deleted",
        message: `Bazar entry ${marketing.itemName} (${marketing.amount} TK) has been deleted.`,
        link: "/marketings",
      });
    }

    return { message: `Marketing with ID ${id} deleted successfully` };
  }

  async removeByDate(messId: string, date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const deleted = await this.prisma.marketing.deleteMany({
      where: {
        messId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    // ✅ Send notification for bulk deletion
    if (deleted.count > 0) {
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
          type: "SYSTEM",
          title: "Bulk Bazar Deletion",
          message: `${deleted.count} bazar entries deleted for ${format(date, "yyyy-MM-dd")}`,
          link: "/marketings",
        });
      }
    }

    return {
      message: `Deleted ${deleted.count} marketing entries for ${format(date, "yyyy-MM-dd")}`,
      count: deleted.count,
    };
  }

  // ==================== DAILY SUMMARY ====================

  private async updateDailySummary(messId: string, date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const marketings = await this.prisma.marketing.findMany({
      where: {
        messId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const dailyMarketCost = marketings.reduce(
      (sum, m) => sum + Number(m.amount),
      0,
    );

    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    const previousStart = startOfDay(previousDay);

    const previousSummary = await this.prisma.dailySummary.findUnique({
      where: {
        messId_date: {
          messId,
          date: previousStart,
        },
      },
    });

    const previousRunningCost = previousSummary?.runningMarketCost || 0;

    const meals = await this.prisma.meal.findMany({
      where: {
        messId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const dailyTotalMeal = meals.reduce((sum, m) => sum + m.totalMeal, 0);
    const runningTotalMeal =
      (previousSummary?.runningTotalMeal || 0) + dailyTotalMeal;
    const runningMarketCost = Number(previousRunningCost) + dailyMarketCost;

    const mealRate =
      runningTotalMeal > 0 ? runningMarketCost / runningTotalMeal : 0;

    const existing = await this.prisma.dailySummary.findUnique({
      where: {
        messId_date: {
          messId,
          date: start,
        },
      },
    });

    if (existing) {
      await this.prisma.dailySummary.update({
        where: {
          messId_date: {
            messId,
            date: start,
          },
        },
        data: {
          dailyMarketCost,
          dailyTotalMeal,
          runningMarketCost,
          runningTotalMeal,
          mealRate,
        },
      });
    } else {
      await this.prisma.dailySummary.create({
        data: {
          messId,
          date: start,
          dailyMarketCost,
          dailyTotalMeal,
          runningMarketCost,
          runningTotalMeal,
          mealRate,
        },
      });
    }
  }
}
