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

  async getAllInventory() {
    const inventoryItems = await this.prisma.inventoryItem.findMany({
      where: { isActive: true },
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
          quantity: Number(item.quantity),
          minStockLevel: Number(item.minStockLevel),
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

  async getByCategory(category: InventoryCategory) {
    const items = await this.prisma.inventoryItem.findMany({
      where: { category, isActive: true },
      orderBy: { name: "asc" },
    });

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: Number(item.quantity),
      minStockLevel: Number(item.minStockLevel),
      lastUpdated: item.lastUpdated,
      isActive: item.isActive,
      status:
        Number(item.quantity) <= Number(item.minStockLevel) &&
        Number(item.minStockLevel) > 0
          ? "LOW_STOCK"
          : "OK",
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }

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
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: Number(item.quantity),
      minStockLevel: Number(item.minStockLevel),
      lastUpdated: item.lastUpdated,
      isActive: item.isActive,
      status:
        Number(item.quantity) <= Number(item.minStockLevel) &&
        Number(item.minStockLevel) > 0
          ? "LOW_STOCK"
          : "OK",
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      logs: item.stockLogs.map((log) => ({
        id: log.id,
        change: Number(log.change),
        previousQuantity: Number(log.previousQuantity),
        newQuantity: Number(log.newQuantity),
        reason: log.reason,
        note: log.note,
        date: log.date,
        createdAt: log.createdAt,
      })),
    };
  }

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
        quantity: dto.initialQuantity,
        minStockLevel: dto.minStockLevel,
        isActive: true,
      },
    });

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

    return {
      ...item,
      quantity: Number(item.quantity),
      minStockLevel: Number(item.minStockLevel),
    };
  }

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
        minStockLevel: dto.minStockLevel,
        isActive: dto.isActive,
      },
    });

    return {
      ...updated,
      quantity: Number(updated.quantity),
      minStockLevel: Number(updated.minStockLevel),
    };
  }

  async addInventory(dto: AddInventoryDto) {
    const { itemName, quantity, note } = dto;

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
        note: note || `${quantity} pieces added to inventory`,
      },
    });

    if (newQuantity <= Number(item.minStockLevel)) {
      await this.sendLowStockAlert(item.name, newQuantity);
    }

    return {
      ...updated,
      quantity: Number(updated.quantity),
      minStockLevel: Number(updated.minStockLevel),
    };
  }

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
        note: note || `${quantity} pieces used from inventory`,
      },
    });

    if (newQuantity <= Number(item.minStockLevel)) {
      await this.sendLowStockAlert(item.name, newQuantity);
    }

    return {
      ...updated,
      quantity: Number(updated.quantity),
      minStockLevel: Number(updated.minStockLevel),
    };
  }

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

    if (quantity <= Number(item.minStockLevel)) {
      await this.sendLowStockAlert(item.name, quantity);
    }

    return {
      ...updated,
      quantity: Number(updated.quantity),
      minStockLevel: Number(updated.minStockLevel),
    };
  }

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
          },
        },
      },
      orderBy: { date: "desc" },
      take: 50,
    });
  }

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

    return {
      available: isAvailable,
      availableQuantity,
      requiredQuantity,
      itemName,
    };
  }

  async deleteInventoryItem(itemName: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { name: itemName },
    });

    if (!item) {
      throw new NotFoundException(`Inventory item "${itemName}" not found`);
    }

    await this.prisma.inventoryItem.update({
      where: { id: item.id },
      data: { isActive: false },
    });

    return { message: `Item "${itemName}" deleted successfully` };
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
