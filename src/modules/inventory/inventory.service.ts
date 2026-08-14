// src/modules/inventory/inventory.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { InventoryCategory } from "@prisma/client";
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
      where: { isActive: true },
      include: {
        stockLogs: {
          orderBy: { date: "desc" },
          take: 5,
        },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    const grouped = inventoryItems.reduce(
      (acc, item) => {
        const category = item.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push({
          id: item.id,
          name: item.name,
          category: item.category,
          unit: item.unit,
          quantity: Number(item.quantity),
          minStockLevel: Number(item.minStockLevel),
          purchasePrice: item.purchasePrice
            ? Number(item.purchasePrice)
            : undefined,
          sellingPrice: item.sellingPrice
            ? Number(item.sellingPrice)
            : undefined,
          lastUpdated: item.lastUpdated,
          isActive: item.isActive,
          status:
            Number(item.quantity) <= Number(item.minStockLevel) &&
            Number(item.minStockLevel) > 0
              ? "LOW_STOCK"
              : "OK",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
        return acc;
      },
      {} as Record<string, any[]>,
    );

    return grouped;
  }

  // ==================== GET SUMMARY ====================

  async getSummary() {
    const inventoryItems = await this.prisma.inventoryItem.findMany({
      where: { isActive: true },
    });

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

  // ==================== GET BY CATEGORY ====================

  async getByCategory(category: InventoryCategory) {
    const items = await this.prisma.inventoryItem.findMany({
      where: { category, isActive: true },
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

  // ==================== GET SINGLE ITEM ====================

  async getInventoryItem(itemName: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { name: itemName, isActive: true },
      include: {
        stockLogs: {
          orderBy: { date: "desc" },
          take: 20,
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
      status:
        Number(item.quantity) <= Number(item.minStockLevel) &&
        Number(item.minStockLevel) > 0
          ? "LOW_STOCK"
          : "OK",
    };
  }

  // ==================== CREATE ITEM ====================

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
        quantity: dto.initialQuantity,
        minStockLevel: dto.minStockLevel,
        purchasePrice: dto.purchasePrice,
        sellingPrice: dto.sellingPrice,
        isActive: true,
      },
    });

    // Create initial stock log
    await this.prisma.inventoryLog.create({
      data: {
        inventoryItemId: item.id,
        change: dto.initialQuantity,
        previousQuantity: 0,
        newQuantity: dto.initialQuantity,
        reason: "INITIAL",
        note: "Initial inventory setup",
      },
    });

    // Notify everyone
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    });

    for (const user of users) {
      await this.notificationsService.create({
        userId: user.id,
        type: "INVENTORY",
        title: `New Inventory Item: ${dto.name}`,
        message: `${dto.name} has been added to ${dto.category} with ${dto.initialQuantity} ${dto.unit}.`,
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

  // ==================== UPDATE ITEM ====================

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
        isActive: dto.isActive,
      },
    });

    // Notify everyone
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    });

    for (const user of users) {
      await this.notificationsService.create({
        userId: user.id,
        type: "INVENTORY",
        title: `Inventory Item Updated: ${dto.name || itemName}`,
        message: `${dto.name || itemName} has been updated.`,
        link: "/inventory",
      });
    }

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
    const { itemName, quantity, unit, note, marketingId } = dto;

    if (quantity <= 0) {
      throw new BadRequestException("Quantity must be greater than 0");
    }

    let item = await this.prisma.inventoryItem.findFirst({
      where: { name: itemName, isActive: true },
    });

    if (!item) {
      const category = this.detectCategory(itemName);
      item = await this.prisma.inventoryItem.create({
        data: {
          name: itemName,
          category,
          unit: unit || "KG",
          quantity: 0,
          minStockLevel: 5,
          isActive: true,
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

    await this.prisma.inventoryLog.create({
      data: {
        inventoryItemId: item.id,
        change: quantity,
        previousQuantity: previousQuantity,
        newQuantity: newQuantity,
        reason: "PURCHASE",
        note: note || `${quantity} ${unit || "KG"} added to inventory`,
        marketingId: marketingId || null,
      },
    });

    // Notify everyone about stock update
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    });

    for (const user of users) {
      await this.notificationsService.create({
        userId: user.id,
        type: "INVENTORY",
        title: `Stock Updated: ${itemName}`,
        message: `${quantity} ${unit || "KG"} ${itemName} added. New stock: ${newQuantity}`,
        link: "/inventory",
      });
    }

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
      where: { name: itemName, isActive: true },
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

    // Notify everyone about stock update
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    });

    for (const user of users) {
      await this.notificationsService.create({
        userId: user.id,
        type: "INVENTORY",
        title: `Stock Updated: ${itemName}`,
        message: `${quantity} ${item.unit} ${itemName} removed. New stock: ${newQuantity}`,
        link: "/inventory",
      });
    }

    if (newQuantity <= Number(item.minStockLevel)) {
      await this.sendLowStockAlert(item.name, newQuantity);
    }

    return {
      ...updated,
      quantity: Number(updated.quantity),
      minStockLevel: Number(updated.minStockLevel),
    };
  }

  // ==================== SET INVENTORY ====================

  async setInventory(dto: SetInventoryDto) {
    const { itemName, quantity, note } = dto;

    if (quantity < 0) {
      throw new BadRequestException("Quantity cannot be negative");
    }

    let item = await this.prisma.inventoryItem.findFirst({
      where: { name: itemName, isActive: true },
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
          isActive: true,
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

    // Notify everyone
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    });

    for (const user of users) {
      await this.notificationsService.create({
        userId: user.id,
        type: "INVENTORY",
        title: `Inventory Updated: ${itemName}`,
        message: `${itemName} stock set to ${quantity}. Previous: ${previousQuantity}.`,
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
          inventoryItem: {
            select: {
              id: true,
              name: true,
              category: true,
              unit: true,
            },
          },
        },
        orderBy: { date: "desc" },
      });
    }

    return this.prisma.inventoryLog.findMany({
      include: {
        inventoryItem: {
          select: {
            id: true,
            name: true,
            category: true,
            unit: true,
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
      where: { name: itemName, isActive: true },
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
      const users = await this.prisma.user.findMany({
        where: { isActive: true },
      });

      for (const user of users) {
        await this.notificationsService.create({
          userId: user.id,
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

  // ==================== DELETE ITEM ====================

  async deleteInventoryItem(itemName: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { name: itemName },
    });

    if (!item) {
      throw new NotFoundException(`Inventory item "${itemName}" not found`);
    }

    // Soft delete - just deactivate
    await this.prisma.inventoryItem.update({
      where: { id: item.id },
      data: { isActive: false },
    });

    // Notify everyone
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    });

    for (const user of users) {
      await this.notificationsService.create({
        userId: user.id,
        type: "INVENTORY",
        title: `Inventory Item Deleted: ${itemName}`,
        message: `${itemName} has been removed from inventory.`,
        link: "/inventory",
      });
    }

    return { message: `Item "${itemName}" deleted successfully` };
  }

  // ==================== LOW STOCK ALERT ====================

  private async sendLowStockAlert(itemName: string, quantity: number) {
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    });

    for (const user of users) {
      await this.notificationsService.create({
        userId: user.id,
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
      "tilapia",
      "catfish",
    ];
    const meatKeywords = [
      "chicken",
      "beef",
      "mutton",
      "egg",
      "meat",
      "lamb",
      "pork",
    ];
    const vegetableKeywords = [
      "potato",
      "onion",
      "garlic",
      "ginger",
      "tomato",
      "chilli",
      "cucumber",
      "vegetable",
      "brinjal",
      "carrot",
      "beans",
      "peas",
      "cabbage",
      "cauliflower",
    ];
    const riceKeywords = [
      "rice",
      "miniket",
      "nazirshail",
      "irri",
      "polao",
      "biriyani",
    ];
    const oilKeywords = ["oil", "soybean", "mustard", "sunflower", "olive"];
    const spiceKeywords = [
      "salt",
      "turmeric",
      "chilli powder",
      "cumin",
      "coriander",
      "spice",
      "pepper",
      "cinnamon",
      "cardamom",
      "clove",
    ];
    const dairyKeywords = [
      "milk",
      "yogurt",
      "butter",
      "cheese",
      "curd",
      "ghee",
    ];
    const fruitKeywords = [
      "apple",
      "banana",
      "orange",
      "mango",
      "fruit",
      "grape",
      "watermelon",
    ];

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
