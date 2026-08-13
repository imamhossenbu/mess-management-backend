// src/modules/inventory/inventory.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { InventoryCategory, Unit } from "@prisma/client";
import {
  AddInventoryDto,
  RemoveInventoryDto,
  SetInventoryDto,
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
} from "./dto";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ==================== GET ALL INVENTORY ====================

  async getAllInventory() {
    const inventoryItems = await this.prisma.inventoryItem.findMany({
      include: {
        stockLogs: {
          orderBy: { date: "desc" },
          take: 5,
        },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    // Group by category
    const grouped = inventoryItems.reduce(
      (acc, item) => {
        const category = item.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push({
          ...item,
          quantity: Number(item.quantity),
          minStockLevel: Number(item.minStockLevel),
          purchasePrice: item.purchasePrice
            ? Number(item.purchasePrice)
            : undefined,
          sellingPrice: item.sellingPrice
            ? Number(item.sellingPrice)
            : undefined,
          status:
            Number(item.quantity) <= Number(item.minStockLevel) &&
            Number(item.minStockLevel) > 0
              ? "LOW_STOCK"
              : "OK",
        });
        return acc;
      },
      {} as Record<string, any[]>,
    );

    return grouped;
  }

  // ==================== GET INVENTORY SUMMARY ====================

  async getSummary() {
    const inventoryItems = await this.prisma.inventoryItem.findMany();

    const categories = inventoryItems.reduce(
      (acc, item) => {
        const category = item.category;
        if (!acc[category]) {
          acc[category] = {
            items: [],
            totalItems: 0,
            lowStockItems: 0,
          };
        }
        acc[category].items.push(item);
        acc[category].totalItems++;
        if (
          Number(item.quantity) <= Number(item.minStockLevel) &&
          Number(item.minStockLevel) > 0
        ) {
          acc[category].lowStockItems++;
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    const totalItems = inventoryItems.length;
    const lowStockItems = inventoryItems.filter(
      (item) =>
        Number(item.quantity) <= Number(item.minStockLevel) &&
        Number(item.minStockLevel) > 0,
    ).length;

    return {
      totalItems,
      lowStockItems,
      categories,
    };
  }

  // ==================== GET INVENTORY BY CATEGORY ====================

  async getByCategory(category: InventoryCategory) {
    const items = await this.prisma.inventoryItem.findMany({
      where: { category },
      include: {
        stockLogs: {
          orderBy: { date: "desc" },
          take: 10,
        },
      },
      orderBy: { name: "asc" },
    });

    return items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      minStockLevel: Number(item.minStockLevel),
      purchasePrice: item.purchasePrice
        ? Number(item.purchasePrice)
        : undefined,
      sellingPrice: item.sellingPrice ? Number(item.sellingPrice) : undefined,
      status:
        Number(item.quantity) <= Number(item.minStockLevel) &&
        Number(item.minStockLevel) > 0
          ? "LOW_STOCK"
          : "OK",
    }));
  }

  // ==================== GET SINGLE INVENTORY ITEM ====================

  async getInventoryItem(itemName: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { name: itemName },
      include: {
        stockLogs: {
          orderBy: { date: "desc" },
          take: 20,
          include: {
            marketingItem: {
              include: {
                marketing: {
                  select: {
                    id: true,
                    shopName: true,
                    date: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Inventory item "${itemName}" not found`);
    }

    return {
      ...item,
      quantity: Number(item.quantity),
      minStockLevel: Number(item.minStockLevel),
      purchasePrice: item.purchasePrice
        ? Number(item.purchasePrice)
        : undefined,
      sellingPrice: item.sellingPrice ? Number(item.sellingPrice) : undefined,
    };
  }

  // ==================== CREATE INVENTORY ITEM ====================

  async createInventoryItem(dto: CreateInventoryItemDto) {
    const existing = await this.prisma.inventoryItem.findFirst({
      where: {
        name: dto.name,
        category: dto.category,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Item "${dto.name}" already exists in ${dto.category}`,
      );
    }

    const item = await this.prisma.inventoryItem.create({
      data: {
        name: dto.name,
        category: dto.category,
        unit: dto.unit,
        quantity: dto.quantity,
        minStockLevel: dto.minStockLevel,
        purchasePrice: dto.purchasePrice,
        sellingPrice: dto.sellingPrice,
      },
    });

    // Create initial stock log
    await this.prisma.inventoryLog.create({
      data: {
        inventoryItemId: item.id,
        change: dto.quantity,
        previousQuantity: 0,
        newQuantity: dto.quantity,
        reason: "INITIAL",
        note: "Initial inventory setup",
      },
    });

    // Notify admins
    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "INVENTORY",
        title: `New Inventory Item: ${dto.name}`,
        message: `${dto.name} has been added to ${dto.category} with ${dto.quantity} ${dto.unit}.`,
        link: "/inventory",
      });
    }

    return {
      ...item,
      quantity: Number(item.quantity),
      minStockLevel: Number(item.minStockLevel),
      purchasePrice: item.purchasePrice
        ? Number(item.purchasePrice)
        : undefined,
      sellingPrice: item.sellingPrice ? Number(item.sellingPrice) : undefined,
    };
  }

  // ==================== UPDATE INVENTORY ITEM ====================

  async updateInventoryItem(itemName: string, dto: UpdateInventoryItemDto) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { name: itemName },
    });

    if (!item) {
      throw new NotFoundException(`Inventory item "${itemName}" not found`);
    }

    const updated = await this.prisma.inventoryItem.update({
      where: { id: item.id },
      data: {
        name: dto.name,
        category: dto.category,
        unit: dto.unit,
        minStockLevel: dto.minStockLevel,
        purchasePrice: dto.purchasePrice,
        sellingPrice: dto.sellingPrice,
      },
    });

    return {
      ...updated,
      quantity: Number(updated.quantity),
      minStockLevel: Number(updated.minStockLevel),
      purchasePrice: updated.purchasePrice
        ? Number(updated.purchasePrice)
        : undefined,
      sellingPrice: updated.sellingPrice
        ? Number(updated.sellingPrice)
        : undefined,
    };
  }

  // ==================== ADD INVENTORY ====================

  async addInventory(dto: AddInventoryDto) {
    const { itemName, quantity, unit, marketingItemId, note } = dto;

    if (quantity <= 0) {
      throw new BadRequestException("Quantity must be greater than 0");
    }

    // Find or create inventory item
    let item = await this.prisma.inventoryItem.findFirst({
      where: { name: itemName },
    });

    if (!item) {
      // Auto-detect category
      const category = this.detectCategory(itemName);
      item = await this.prisma.inventoryItem.create({
        data: {
          name: itemName,
          category,
          unit: unit || "KG",
          quantity: 0,
          minStockLevel: 5,
        },
      });
    }

    const previousQuantity = Number(item.quantity);
    const newQuantity = previousQuantity + quantity;

    const updated = await this.prisma.inventoryItem.update({
      where: { id: item.id },
      data: {
        quantity: newQuantity,
        lastUpdated: new Date(),
      },
    });

    // Create stock log
    await this.prisma.inventoryLog.create({
      data: {
        inventoryItemId: item.id,
        change: quantity,
        previousQuantity: previousQuantity,
        newQuantity: newQuantity,
        reason: "PURCHASE",
        note: note || `${quantity} ${unit || "KG"} added to inventory`,
        marketingItemId: marketingItemId || null,
      },
    });

    // Update marketing item if linked
    if (marketingItemId) {
      await this.prisma.marketingItem.update({
        where: { id: marketingItemId },
        data: {
          addedToInventory: true,
        },
      });
    }

    // Check for low stock notification
    if (newQuantity <= Number(item.minStockLevel)) {
      await this.sendLowStockAlert(item.name, newQuantity);
    }

    return {
      ...updated,
      quantity: Number(updated.quantity),
      minStockLevel: Number(updated.minStockLevel),
    };
  }

  // ==================== REMOVE INVENTORY ====================

  async removeInventory(dto: RemoveInventoryDto) {
    const { itemName, quantity, note } = dto;

    if (quantity <= 0) {
      throw new BadRequestException("Quantity must be greater than 0");
    }

    const item = await this.prisma.inventoryItem.findFirst({
      where: { name: itemName },
    });

    if (!item) {
      throw new NotFoundException(`Inventory item "${itemName}" not found`);
    }

    const currentQuantity = Number(item.quantity);
    if (currentQuantity < quantity) {
      throw new BadRequestException(
        `Insufficient quantity. Available: ${currentQuantity}, Requested: ${quantity}`,
      );
    }

    const newQuantity = currentQuantity - quantity;

    const updated = await this.prisma.inventoryItem.update({
      where: { id: item.id },
      data: {
        quantity: newQuantity,
        lastUpdated: new Date(),
      },
    });

    // Create stock log
    await this.prisma.inventoryLog.create({
      data: {
        inventoryItemId: item.id,
        change: -quantity,
        previousQuantity: currentQuantity,
        newQuantity: newQuantity,
        reason: "USED",
        note: note || `${quantity} used from inventory`,
      },
    });

    // Check for low stock
    if (newQuantity <= Number(item.minStockLevel)) {
      await this.sendLowStockAlert(item.name, newQuantity);
    }

    return {
      ...updated,
      quantity: Number(updated.quantity),
      minStockLevel: Number(updated.minStockLevel),
    };
  }

  // ==================== SET INVENTORY (Manual) ====================

  async setInventory(dto: SetInventoryDto) {
    const { itemName, quantity, note } = dto;

    if (quantity < 0) {
      throw new BadRequestException("Quantity cannot be negative");
    }

    let item = await this.prisma.inventoryItem.findFirst({
      where: { name: itemName },
    });

    if (!item) {
      const category = this.detectCategory(itemName);
      item = await this.prisma.inventoryItem.create({
        data: {
          name: itemName,
          category,
          unit: "KG",
          quantity: 0,
          minStockLevel: 5,
        },
      });
    }

    const previousQuantity = Number(item.quantity);
    const change = quantity - previousQuantity;

    const updated = await this.prisma.inventoryItem.update({
      where: { id: item.id },
      data: {
        quantity: quantity,
        lastUpdated: new Date(),
      },
    });

    if (change !== 0) {
      await this.prisma.inventoryLog.create({
        data: {
          inventoryItemId: item.id,
          change: change,
          previousQuantity: previousQuantity,
          newQuantity: quantity,
          reason: "MANUAL",
          note: note || `Manually set to ${quantity}`,
        },
      });
    }

    // Notify admins
    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "INVENTORY",
        title: `Inventory Updated: ${itemName}`,
        message: `${itemName} stock manually set to ${quantity}. Previous: ${previousQuantity}.`,
        link: "/inventory",
      });
    }

    if (quantity <= Number(item.minStockLevel)) {
      await this.sendLowStockAlert(item.name, quantity);
    }

    return {
      ...updated,
      quantity: Number(updated.quantity),
      minStockLevel: Number(updated.minStockLevel),
    };
  }

  // ==================== GET STOCK LOGS ====================

  async getStockLogs(itemName?: string) {
    if (itemName) {
      const item = await this.prisma.inventoryItem.findFirst({
        where: { name: itemName },
      });

      if (!item) {
        throw new NotFoundException(`Inventory item "${itemName}" not found`);
      }

      return this.prisma.inventoryLog.findMany({
        where: { inventoryItemId: item.id },
        include: {
          inventoryItem: true,
          marketingItem: {
            include: {
              marketing: {
                select: {
                  id: true,
                  shopName: true,
                  date: true,
                },
              },
            },
          },
        },
        orderBy: { date: "desc" },
      });
    }

    return this.prisma.inventoryLog.findMany({
      include: {
        inventoryItem: true,
        marketingItem: {
          include: {
            marketing: {
              select: {
                id: true,
                shopName: true,
                date: true,
              },
            },
          },
        },
      },
      orderBy: { date: "desc" },
      take: 50,
    });
  }

  // ==================== CHECK AVAILABILITY ====================

  async checkAvailability(itemName: string, requiredQuantity: number) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { name: itemName },
    });

    if (!item) {
      return {
        available: false,
        availableQuantity: 0,
        requiredQuantity,
        itemName,
        message: `Item "${itemName}" not found in inventory`,
      };
    }

    const availableQuantity = Number(item.quantity);
    const isAvailable = availableQuantity >= requiredQuantity;

    if (!isAvailable) {
      const admins = await this.prisma.user.findMany({
        where: { role: "ADMIN", isActive: true },
      });

      for (const admin of admins) {
        await this.notificationsService.create({
          userId: admin.id,
          type: "INVENTORY",
          title: `Stock Check Failed: ${itemName}`,
          message: `Stock check failed for ${itemName}. Required: ${requiredQuantity}, Available: ${availableQuantity}`,
          link: "/inventory",
        });
      }
    }

    return {
      available: isAvailable,
      availableQuantity,
      requiredQuantity,
      itemName,
      unit: item.unit,
    };
  }

  // ==================== LOW STOCK ALERT ====================

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

  // ==================== AUTO-DETECT CATEGORY ====================

  private detectCategory(name: string): InventoryCategory {
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
      "prawn",
    ];
    const meatKeywords = ["chicken", "beef", "mutton", "egg", "meat"];
    const vegetableKeywords = [
      "potato",
      "onion",
      "garlic",
      "ginger",
      "tomato",
      "chilli",
      "cucumber",
      "vegetable",
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
    const fruitKeywords = ["apple", "banana", "orange", "mango", "fruit"];

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
