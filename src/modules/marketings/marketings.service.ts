// src/modules/marketings/marketings.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CreateMarketingDto,
  UpdateMarketingDto,
  MarketingItemDto,
} from "./dto";
import { PaymentType } from "@prisma/client";
import { startOfDay, endOfDay, format } from "date-fns";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class MarketingsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ==================== CREATE ====================

  async create(userId: string, createMarketingDto: CreateMarketingDto) {
    // Check if user exists and is active
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(`User not found or inactive`);
    }

    const date = createMarketingDto.date
      ? new Date(createMarketingDto.date)
      : new Date();

    // Calculate total amount from items
    const totalAmount = createMarketingDto.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    // 1. Create Marketing Entry with items
    const marketing = await this.prisma.marketing.create({
      data: {
        userId,
        date: date,
        shopName: createMarketingDto.shopName,
        totalAmount: totalAmount,
        paymentType: createMarketingDto.paymentType || PaymentType.CASH,
        note: createMarketingDto.note,
        items: {
          create: createMarketingDto.items.map((item) => ({
            itemName: item.itemName,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
            totalPrice: item.totalPrice,
            note: item.note,
            addedToInventory: false,
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

    // 2. Process inventory for items that need to be added
    for (const item of createMarketingDto.items) {
      if (item.addToInventory) {
        await this.addToInventory(item, marketing.id);
      }
    }

    // 3. Update Daily Summary
    await this.updateDailySummary(date);

    // 4. Send notifications
    await this.sendNotifications(marketing, user);

    // Return with proper typing
    return {
      id: marketing.id,
      userId: marketing.userId,
      date: marketing.date,
      shopName: marketing.shopName,
      totalAmount: Number(marketing.totalAmount),
      paymentType: marketing.paymentType,
      note: marketing.note,
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
        addedToInventory: i.addedToInventory,
        inventoryItemId: i.inventoryItemId,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    };
  }

  // ==================== ADD TO INVENTORY ====================

  private async addToInventory(item: MarketingItemDto, marketingId: string) {
    // Find or create inventory item
    let inventoryItem = await this.prisma.inventoryItem.findFirst({
      where: { name: item.itemName },
    });

    if (!inventoryItem) {
      const category = this.detectCategory(item.itemName);
      inventoryItem = await this.prisma.inventoryItem.create({
        data: {
          name: item.itemName,
          category,
          unit: item.unit,
          quantity: 0,
          minStockLevel: 5,
        },
      });
    }

    // Get the marketing item
    const marketingItem = await this.prisma.marketingItem.findFirst({
      where: {
        marketingId,
        itemName: item.itemName,
      },
    });

    if (!marketingItem) {
      throw new NotFoundException(`Marketing item not found`);
    }

    const previousQuantity = Number(inventoryItem.quantity);
    const newQuantity = previousQuantity + item.quantity;

    // Update inventory quantity
    await this.prisma.inventoryItem.update({
      where: { id: inventoryItem.id },
      data: {
        quantity: newQuantity,
        lastUpdated: new Date(),
      },
    });

    // Create inventory log
    await this.prisma.inventoryLog.create({
      data: {
        inventoryItemId: inventoryItem.id,
        change: item.quantity,
        previousQuantity: previousQuantity,
        newQuantity: newQuantity,
        reason: "PURCHASE",
        note: `Added from marketing ${marketingId}`,
        marketingItemId: marketingItem.id,
      },
    });

    // Update marketing item
    await this.prisma.marketingItem.update({
      where: { id: marketingItem.id },
      data: {
        addedToInventory: true,
        inventoryItemId: inventoryItem.id,
      },
    });

    // Check low stock
    if (newQuantity <= Number(inventoryItem.minStockLevel)) {
      await this.sendLowStockAlert(inventoryItem.name, newQuantity);
    }
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
        addedToInventory: i.addedToInventory,
        inventoryItemId: i.inventoryItemId,
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
        addedToInventory: i.addedToInventory,
        inventoryItemId: i.inventoryItemId,
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
        addedToInventory: i.addedToInventory,
        inventoryItemId: i.inventoryItemId,
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
        addedToInventory: i.addedToInventory,
        inventoryItemId: i.inventoryItemId,
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

    // High spending alert
    if (totalAmount > 10000) {
      const admins = await this.prisma.user.findMany({
        where: { role: "ADMIN", isActive: true },
      });

      for (const admin of admins) {
        await this.notificationsService.create({
          userId: admin.id,
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
      items: items.map((m) => ({
        id: m.id,
        userId: m.userId,
        date: m.date,
        shopName: m.shopName,
        totalAmount: Number(m.totalAmount),
        paymentType: m.paymentType,
        note: m.note,
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
          addedToInventory: i.addedToInventory,
          inventoryItemId: i.inventoryItemId,
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
        items: true,
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

    // Category summary
    const categoryMap = new Map<
      string,
      { totalAmount: number; count: number }
    >();

    for (const item of items) {
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

    // High monthly spending alert
    if (totalAmount > 50000) {
      const admins = await this.prisma.user.findMany({
        where: { role: "ADMIN", isActive: true },
      });

      for (const admin of admins) {
        await this.notificationsService.create({
          userId: admin.id,
          type: "SYSTEM",
          title: "High Monthly Bazar Spending",
          message: `Total bazar cost for ${format(startDate, "MMMM yyyy")} is ${totalAmount} TK. Please review.`,
          link: "/marketings/monthly",
        });
      }
    }

    return {
      month: format(startDate, "MMMM"),
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
      include: { items: true },
    });

    if (!existing) {
      throw new NotFoundException(`Marketing with ID ${id} not found`);
    }

    // Update marketing
    const updated = await this.prisma.marketing.update({
      where: { id },
      data: {
        shopName: updateMarketingDto.shopName,
        paymentType: updateMarketingDto.paymentType,
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
        items: true,
      },
    });

    // Send notification
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

    return {
      id: updated.id,
      userId: updated.userId,
      date: updated.date,
      shopName: updated.shopName,
      totalAmount: Number(updated.totalAmount),
      paymentType: updated.paymentType,
      note: updated.note,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      userName: updated.user?.name || "Unknown",
      items: updated.items.map((i) => ({
        id: i.id,
        itemName: i.itemName,
        quantity: Number(i.quantity),
        unit: i.unit,
        price: Number(i.price),
        totalPrice: Number(i.totalPrice),
        note: i.note,
        addedToInventory: i.addedToInventory,
        inventoryItemId: i.inventoryItemId,
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

    // Delete all items first
    await this.prisma.marketingItem.deleteMany({
      where: { marketingId: id },
    });

    // Delete marketing
    await this.prisma.marketing.delete({
      where: { id },
    });

    // Send notification
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

  // ==================== NOTIFICATIONS ====================

  private async sendNotifications(marketing: any, user: any) {
    // Notify the user who created
    await this.notificationsService.create({
      userId: user.id,
      type: "SYSTEM",
      title: "Bazar Entry Added",
      message: `You have added a bazar entry: ${marketing.shopName || "Bazar"} - ${marketing.totalAmount} TK`,
      link: `/marketings/${marketing.id}`,
    });

    // Notify all admins
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

  private async sendLowStockAlert(itemName: string, quantity: number) {
    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "STOCK_ALERT",
        title: `Low Stock: ${itemName}`,
        message: `${itemName} is running low. Current stock: ${quantity}. Please restock soon.`,
        link: "/inventory",
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
      where: {
        date: previousStart,
      },
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
      where: {
        date: start,
      },
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

  // ==================== AUTO-DETECT CATEGORY ====================

  private detectCategory(name: string): any {
    const nameLower = name.toLowerCase();

    const fishKeywords = [
      "fish",
      "rui",
      "koi",
      "pabda",
      "mrigel",
      "shrimp",
      "chingri",
      "koral",
    ];
    const meatKeywords = ["chicken", "beef", "mutton", "egg"];
    const vegetableKeywords = [
      "potato",
      "onion",
      "garlic",
      "ginger",
      "tomato",
      "chilli",
      "cucumber",
    ];
    const riceKeywords = ["rice", "miniket", "nazirshail", "irri"];
    const oilKeywords = ["oil", "soybean", "mustard"];
    const spiceKeywords = [
      "salt",
      "turmeric",
      "chilli powder",
      "cumin",
      "coriander",
    ];
    const dairyKeywords = ["milk", "yogurt", "butter", "cheese"];
    const fruitKeywords = ["apple", "banana", "orange", "mango"];

    if (fishKeywords.some((k) => nameLower.includes(k))) return "FISH";
    if (meatKeywords.some((k) => nameLower.includes(k))) return "MEAT";
    if (vegetableKeywords.some((k) => nameLower.includes(k)))
      return "VEGETABLE";
    if (riceKeywords.some((k) => nameLower.includes(k))) return "RICE";
    if (oilKeywords.some((k) => nameLower.includes(k))) return "OIL";
    if (spiceKeywords.some((k) => nameLower.includes(k))) return "SPICE";
    if (dairyKeywords.some((k) => nameLower.includes(k))) return "DAIRY";
    if (fruitKeywords.some((k) => nameLower.includes(k))) return "FRUIT";

    return "OTHER";
  }
}
