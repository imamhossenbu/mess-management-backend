// src/modules/marketings/marketings.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateMarketingDto, UpdateMarketingDto } from "./dto";
import { PaymentType, InventoryType } from "@prisma/client";
import { startOfDay, endOfDay, format, getMonth, getYear } from "date-fns";
import { InventoryService } from "../inventory/inventory.service";

@Injectable()
export class MarketingsService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
  ) {}

  // ==================== CREATE ====================

  async create(createMarketingDto: CreateMarketingDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createMarketingDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createMarketingDto.userId} not found`,
      );
    }

    const date = createMarketingDto.date
      ? new Date(createMarketingDto.date)
      : new Date();

    // 1. Create Marketing Entry
    const marketing = await this.prisma.marketing.create({
      data: {
        userId: createMarketingDto.userId,
        date: date,
        itemName: createMarketingDto.itemName,
        quantity: createMarketingDto.quantity,
        amount: createMarketingDto.amount,
        paymentType: createMarketingDto.paymentType || PaymentType.CASH,
        shopName: createMarketingDto.shopName,
        note: createMarketingDto.note,
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

    // 2. যদি ইনভেন্টরি টাইপ এবং পিস দেওয়া থাকে, তাহলে Inventory Update
    if (createMarketingDto.inventoryType && createMarketingDto.totalPieces) {
      const inventoryType = createMarketingDto.inventoryType as InventoryType;

      // ২.১: ইনভেন্টরিতে যোগ করুন (মোট পিস)
      await this.inventoryService.addInventory({
        type: inventoryType,
        quantity: createMarketingDto.totalPieces,
        marketingId: marketing.id,
        note: `বাজার থেকে ${createMarketingDto.totalPieces} পিস ${createMarketingDto.itemName} কেনা হয়েছে`,
      });

      // ২.২: যদি আজকে ব্যবহার করা হয়, তাহলে বিয়োগ করুন
      if (createMarketingDto.usedPieces && createMarketingDto.usedPieces > 0) {
        await this.inventoryService.removeInventory({
          type: inventoryType,
          quantity: createMarketingDto.usedPieces,
          note: `আজকের রান্নায় ${createMarketingDto.usedPieces} পিস ${createMarketingDto.itemName} ব্যবহার করা হয়েছে`,
        });
      }
    }

    // 3. Daily Summary Update
    await this.updateDailySummary(date);

    return marketing;
  }

  // ==================== FIND ====================

  async findAll() {
    return this.prisma.marketing.findMany({
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
        date: "desc",
      },
    });
  }

  async findOne(id: string) {
    const marketing = await this.prisma.marketing.findUnique({
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

    if (!marketing) {
      throw new NotFoundException(`Marketing with ID ${id} not found`);
    }

    return marketing;
  }

  async findByUser(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      };
    }

    return this.prisma.marketing.findMany({
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
        date: "desc",
      },
    });
  }

  async findByDate(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    return this.prisma.marketing.findMany({
      where: {
        date: {
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

  async getDailySummary(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const items = await this.prisma.marketing.findMany({
      where: {
        date: {
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

  async getMonthlySummary(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const items = await this.prisma.marketing.findMany({
      where: {
        date: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
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

  async update(id: string, updateMarketingDto: UpdateMarketingDto) {
    const existing = await this.prisma.marketing.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Marketing with ID ${id} not found`);
    }

    if (updateMarketingDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateMarketingDto.userId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateMarketingDto.userId} not found`,
        );
      }
    }

    return this.prisma.marketing.update({
      where: { id },
      data: {
        userId: updateMarketingDto.userId,
        itemName: updateMarketingDto.itemName,
        quantity: updateMarketingDto.quantity,
        amount: updateMarketingDto.amount,
        paymentType: updateMarketingDto.paymentType,
        shopName: updateMarketingDto.shopName,
        note: updateMarketingDto.note,
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
  }

  // ==================== DELETE ====================

  async remove(id: string) {
    const marketing = await this.prisma.marketing.findUnique({
      where: { id },
    });

    if (!marketing) {
      throw new NotFoundException(`Marketing with ID ${id} not found`);
    }

    await this.prisma.marketing.delete({
      where: { id },
    });

    return { message: `Marketing with ID ${id} deleted successfully` };
  }

  async removeByDate(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const deleted = await this.prisma.marketing.deleteMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    return {
      message: `Deleted ${deleted.count} marketing entries for ${format(date, "yyyy-MM-dd")}`,
      count: deleted.count,
    };
  }

  // ==================== DAILY SUMMARY ====================

  private async updateDailySummary(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const marketings = await this.prisma.marketing.findMany({
      where: {
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
      where: { date: previousStart },
    });

    const previousRunningCost = previousSummary?.runningMarketCost || 0;

    const meals = await this.prisma.meal.findMany({
      where: {
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
      where: { date: start },
    });

    if (existing) {
      await this.prisma.dailySummary.update({
        where: { date: start },
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
