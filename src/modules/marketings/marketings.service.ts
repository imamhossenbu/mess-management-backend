// src/modules/marketings/marketings.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateMarketingDto, UpdateMarketingDto } from "./dto";
import { PaymentType } from "@prisma/client";
import { startOfDay, endOfDay, format } from "date-fns";
import { NotificationsService } from "../notifications/notifications.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class MarketingsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ==================== CREATE ====================

  async create(
    userId: string,
    createMarketingDto: CreateMarketingDto,
    file?: any,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(`User not found or inactive`);
    }

    // Upload image to Cloudinary
    let imageUrl = null;
    if (file) {
      try {
        imageUrl = await this.cloudinaryService.uploadFile(
          file,
          `marketings/${userId}`,
        );
      } catch (error) {
        throw new BadRequestException("Failed to upload image");
      }
    }

    const date = createMarketingDto.date
      ? new Date(createMarketingDto.date)
      : new Date();

    const totalAmount = createMarketingDto.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    const marketing = await this.prisma.marketing.create({
      data: {
        userId,
        date: date,
        shopName: createMarketingDto.shopName,
        totalAmount: totalAmount,
        paymentType: createMarketingDto.paymentType || PaymentType.CASH,
        note: createMarketingDto.note,
        imageUrl: imageUrl,
        items: {
          create: createMarketingDto.items.map((item) => ({
            itemName: item.itemName,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
            totalPrice: item.totalPrice,
            note: item.note,
          })),
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
        items: true,
      },
    });

    await this.updateDailySummary(date);
    await this.sendNotifications(marketing, user);

    return {
      id: marketing.id,
      userId: marketing.userId,
      date: marketing.date,
      shopName: marketing.shopName,
      totalAmount: Number(marketing.totalAmount),
      paymentType: marketing.paymentType,
      note: marketing.note,
      imageUrl: marketing.imageUrl,
      createdAt: marketing.createdAt,
      updatedAt: marketing.updatedAt,
      userName: marketing.user?.name || "Unknown",
      items: marketing.items.map((i) => ({
        id: i.id,
        itemName: i.itemName,
        quantity: Number(i.quantity),
        unit: i.unit,
        price: Number(i.price),
        totalPrice: Number(i.totalPrice),
        note: i.note,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    };
  }

  // ==================== FIND ALL ====================

  async findAll() {
    const marketings = await this.prisma.marketing.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        items: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return marketings.map((m) => ({
      id: m.id,
      userId: m.userId,
      date: m.date,
      shopName: m.shopName,
      totalAmount: Number(m.totalAmount),
      paymentType: m.paymentType,
      note: m.note,
      imageUrl: m.imageUrl,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      userName: m.user?.name || "Unknown",
      items: m.items.map((i) => ({
        id: i.id,
        itemName: i.itemName,
        quantity: Number(i.quantity),
        unit: i.unit,
        price: Number(i.price),
        totalPrice: Number(i.totalPrice),
        note: i.note,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    }));
  }

  // ==================== FIND ONE ====================

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
        items: true,
      },
    });

    if (!marketing) {
      throw new NotFoundException(`Marketing with ID ${id} not found`);
    }

    return {
      id: marketing.id,
      userId: marketing.userId,
      date: marketing.date,
      shopName: marketing.shopName,
      totalAmount: Number(marketing.totalAmount),
      paymentType: marketing.paymentType,
      note: marketing.note,
      imageUrl: marketing.imageUrl,
      createdAt: marketing.createdAt,
      updatedAt: marketing.updatedAt,
      userName: marketing.user?.name || "Unknown",
      items: marketing.items.map((i) => ({
        id: i.id,
        itemName: i.itemName,
        quantity: Number(i.quantity),
        unit: i.unit,
        price: Number(i.price),
        totalPrice: Number(i.totalPrice),
        note: i.note,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    };
  }

  // ==================== FIND BY USER ====================

  async findByUser(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      };
    }

    const marketings = await this.prisma.marketing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        items: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return marketings.map((m) => ({
      id: m.id,
      userId: m.userId,
      date: m.date,
      shopName: m.shopName,
      totalAmount: Number(m.totalAmount),
      paymentType: m.paymentType,
      note: m.note,
      imageUrl: m.imageUrl,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      userName: m.user?.name || "Unknown",
      items: m.items.map((i) => ({
        id: i.id,
        itemName: i.itemName,
        quantity: Number(i.quantity),
        unit: i.unit,
        price: Number(i.price),
        totalPrice: Number(i.totalPrice),
        note: i.note,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    }));
  }

  // ==================== FIND BY DATE ====================

  async findByDate(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const marketings = await this.prisma.marketing.findMany({
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
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return marketings.map((m) => ({
      id: m.id,
      userId: m.userId,
      date: m.date,
      shopName: m.shopName,
      totalAmount: Number(m.totalAmount),
      paymentType: m.paymentType,
      note: m.note,
      imageUrl: m.imageUrl,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      userName: m.user?.name || "Unknown",
      items: m.items.map((i) => ({
        id: i.id,
        itemName: i.itemName,
        quantity: Number(i.quantity),
        unit: i.unit,
        price: Number(i.price),
        totalPrice: Number(i.totalPrice),
        note: i.note,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    }));
  }

  // ==================== DAILY SUMMARY ====================

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
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.totalAmount),
      0,
    );
    const totalCash = items
      .filter((item) => item.paymentType === PaymentType.CASH)
      .reduce((sum, item) => sum + Number(item.totalAmount), 0);
    const totalDebt = items
      .filter((item) => item.paymentType === PaymentType.DEBT)
      .reduce((sum, item) => sum + Number(item.totalAmount), 0);
    const totalSelf = items
      .filter((item) => item.paymentType === PaymentType.SELF)
      .reduce((sum, item) => sum + Number(item.totalAmount), 0);

    return {
      date: format(date, "yyyy-MM-dd"),
      totalAmount,
      totalCash,
      totalDebt,
      totalSelf,
      totalItems: items.length,
      items: items.map((m) => ({
        id: m.id,
        userId: m.userId,
        date: m.date,
        shopName: m.shopName,
        totalAmount: Number(m.totalAmount),
        paymentType: m.paymentType,
        note: m.note,
        imageUrl: m.imageUrl,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        userName: m.user?.name || "Unknown",
        items: m.items.map((i) => ({
          id: i.id,
          itemName: i.itemName,
          quantity: Number(i.quantity),
          unit: i.unit,
          price: Number(i.price),
          totalPrice: Number(i.totalPrice),
          note: i.note,
          createdAt: i.createdAt,
          updatedAt: i.updatedAt,
        })),
      })),
    };
  }

  // ==================== MONTHLY SUMMARY ====================

  async getMonthlySummary(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const marketings = await this.prisma.marketing.findMany({
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
        items: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const totalAmount = marketings.reduce(
      (sum, item) => sum + Number(item.totalAmount),
      0,
    );
    const totalCash = marketings
      .filter((item) => item.paymentType === PaymentType.CASH)
      .reduce((sum, item) => sum + Number(item.totalAmount), 0);
    const totalDebt = marketings
      .filter((item) => item.paymentType === PaymentType.DEBT)
      .reduce((sum, item) => sum + Number(item.totalAmount), 0);
    const totalSelf = marketings
      .filter((item) => item.paymentType === PaymentType.SELF)
      .reduce((sum, item) => sum + Number(item.totalAmount), 0);

    // Category summary
    const categoryMap = new Map<
      string,
      { totalAmount: number; count: number }
    >();

    for (const item of marketings) {
      for (const subItem of item.items) {
        const existing = categoryMap.get(subItem.itemName);
        if (existing) {
          existing.totalAmount += Number(subItem.totalPrice);
          existing.count += 1;
        } else {
          categoryMap.set(subItem.itemName, {
            totalAmount: Number(subItem.totalPrice),
            count: 1,
          });
        }
      }
    }

    const categorySummary = Array.from(categoryMap.entries()).map(
      ([itemName, data]) => ({
        itemName,
        totalAmount: data.totalAmount,
        count: data.count,
      }),
    );

    // Format marketings for response
    const formattedMarketings = marketings.map((m) => ({
      id: m.id,
      userId: m.userId,
      date: m.date,
      shopName: m.shopName,
      totalAmount: Number(m.totalAmount),
      paymentType: m.paymentType,
      note: m.note,
      imageUrl: m.imageUrl,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      userName: m.user?.name || "Unknown",
      items: m.items.map((i) => ({
        id: i.id,
        itemName: i.itemName,
        quantity: Number(i.quantity),
        unit: i.unit,
        price: Number(i.price),
        totalPrice: Number(i.totalPrice),
        note: i.note,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    }));

    return {
      month: format(startDate, "MMMM"),
      year,
      totalAmount,
      totalCash,
      totalDebt,
      totalSelf,
      totalItems: marketings.length,
      categorySummary: categorySummary.sort(
        (a, b) => b.totalAmount - a.totalAmount,
      ),
      marketings: formattedMarketings,
    };
  }

  // ==================== UPDATE ====================

  // src/modules/marketings/marketings.service.ts (Update method only)

  async update(id: string, updateMarketingDto: UpdateMarketingDto, file?: any) {
    console.log("📦 [SERVICE] Update called with:", {
      id,
      updateMarketingDto,
      file: file ? "Yes" : "No",
    });
    console.log("📦 [SERVICE] Items:", updateMarketingDto.items);

    const existing = await this.prisma.marketing.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing) {
      throw new NotFoundException(`Marketing with ID ${id} not found`);
    }

    // Handle image upload
    let imageUrl = existing.imageUrl;
    if (file) {
      if (existing.imageUrl) {
        await this.cloudinaryService.deleteFile(existing.imageUrl);
      }
      try {
        imageUrl = await this.cloudinaryService.uploadFile(
          file,
          `marketings/${existing.userId}`,
        );
      } catch (error) {
        throw new BadRequestException("Failed to upload image");
      }
    }

    // Update basic info
    const updated = await this.prisma.marketing.update({
      where: { id },
      data: {
        shopName: updateMarketingDto.shopName,
        paymentType: updateMarketingDto.paymentType,
        note: updateMarketingDto.note,
        imageUrl: imageUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        items: true,
      },
    });

    // If items are provided, update them
    if (updateMarketingDto.items && updateMarketingDto.items.length > 0) {
      console.log("📦 [SERVICE] Updating items:", updateMarketingDto.items);

      // Delete existing items
      await this.prisma.marketingItem.deleteMany({
        where: { marketingId: id },
      });

      // Create new items
      await this.prisma.marketingItem.createMany({
        data: updateMarketingDto.items.map((item) => ({
          marketingId: id,
          itemName: item.itemName,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
          totalPrice: item.totalPrice,
          note: item.note,
        })),
      });

      // Recalculate total amount
      const totalAmount = updateMarketingDto.items.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );

      await this.prisma.marketing.update({
        where: { id },
        data: {
          totalAmount: totalAmount,
        },
      });

      console.log("✅ [SERVICE] Items updated, total amount:", totalAmount);
    }

    // Send notifications
    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "SYSTEM",
        title: "Bazar Entry Updated",
        message: `Bazar entry has been updated. Shop: ${updated.shopName || "N/A"}, Amount: ${updated.totalAmount} TK`,
        link: `/marketings/${id}`,
      });
    }

    // Fetch final data
    const finalMarketing = await this.prisma.marketing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        items: true,
      },
    });

    return {
      id: finalMarketing.id,
      userId: finalMarketing.userId,
      date: finalMarketing.date,
      shopName: finalMarketing.shopName,
      totalAmount: Number(finalMarketing.totalAmount),
      paymentType: finalMarketing.paymentType,
      note: finalMarketing.note,
      imageUrl: finalMarketing.imageUrl,
      createdAt: finalMarketing.createdAt,
      updatedAt: finalMarketing.updatedAt,
      userName: finalMarketing.user?.name || "Unknown",
      items: finalMarketing.items.map((i) => ({
        id: i.id,
        itemName: i.itemName,
        quantity: Number(i.quantity),
        unit: i.unit,
        price: Number(i.price),
        totalPrice: Number(i.totalPrice),
        note: i.note,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    };
  }

  // ==================== DELETE ====================

  async remove(id: string) {
    const marketing = await this.prisma.marketing.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!marketing) {
      throw new NotFoundException(`Marketing with ID ${id} not found`);
    }

    if (marketing.imageUrl) {
      await this.cloudinaryService.deleteFile(marketing.imageUrl);
    }

    await this.prisma.marketingItem.deleteMany({
      where: { marketingId: id },
    });

    await this.prisma.marketing.delete({
      where: { id },
    });

    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "SYSTEM",
        title: "Bazar Entry Deleted",
        message: `Bazar entry has been deleted. Shop: ${marketing.shopName || "N/A"}, Amount: ${marketing.totalAmount} TK`,
        link: "/marketings",
      });
    }

    return { message: `Marketing with ID ${id} deleted successfully` };
  }

  // ==================== DELETE BY DATE ====================

  async removeByDate(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const marketings = await this.prisma.marketing.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      select: { id: true, imageUrl: true },
    });

    for (const marketing of marketings) {
      if (marketing.imageUrl) {
        await this.cloudinaryService.deleteFile(marketing.imageUrl);
      }
    }

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

  // ==================== NOTIFICATIONS ====================

  private async sendNotifications(marketing: any, user: any) {
    await this.notificationsService.create({
      userId: user.id,
      type: "SYSTEM",
      title: "Bazar Entry Added",
      message: `You have added a bazar entry: ${marketing.shopName || "Bazar"} - ${marketing.totalAmount} TK`,
      link: `/marketings/${marketing.id}`,
    });

    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "SYSTEM",
        title: "New Bazar Entry",
        message: `${user.name} added bazar: ${marketing.shopName || "Bazar"} - ${marketing.totalAmount} TK`,
        link: `/marketings/${marketing.id}`,
      });
    }
  }

  // ==================== DAILY SUMMARY UPDATE ====================

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
      (sum, m) => sum + Number(m.totalAmount),
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
