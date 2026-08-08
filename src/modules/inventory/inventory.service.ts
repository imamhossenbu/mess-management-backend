// src/modules/inventory/inventory.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { InventoryType } from "@prisma/client";
import { AddInventoryDto, RemoveInventoryDto, SetInventoryDto } from "./dto";

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // ==================== GET ====================

  async getAllInventory() {
    let meat = await this.prisma.inventory.findUnique({
      where: { type: InventoryType.MEAT },
      include: {
        logs: {
          orderBy: { date: "desc" },
          take: 10,
          include: {
            marketing: {
              select: {
                id: true,
                itemName: true,
                quantity: true,
                amount: true,
                shopName: true,
                date: true,
              },
            },
          },
        },
      },
    });
    let fish = await this.prisma.inventory.findUnique({
      where: { type: InventoryType.FISH },
      include: {
        logs: {
          orderBy: { date: "desc" },
          take: 10,
          include: {
            marketing: {
              select: {
                id: true,
                itemName: true,
                quantity: true,
                amount: true,
                shopName: true,
                date: true,
              },
            },
          },
        },
      },
    });

    if (!meat) {
      meat = await this.prisma.inventory.create({
        data: { type: InventoryType.MEAT, quantity: 0 },
        include: {
          logs: {
            orderBy: { date: "desc" },
            take: 10,
            include: {
              marketing: {
                select: {
                  id: true,
                  itemName: true,
                  quantity: true,
                  amount: true,
                  shopName: true,
                  date: true,
                },
              },
            },
          },
        },
      });
    }
    if (!fish) {
      fish = await this.prisma.inventory.create({
        data: { type: InventoryType.FISH, quantity: 0 },
        include: {
          logs: {
            orderBy: { date: "desc" },
            take: 10,
            include: {
              marketing: {
                select: {
                  id: true,
                  itemName: true,
                  quantity: true,
                  amount: true,
                  shopName: true,
                  date: true,
                },
              },
            },
          },
        },
      });
    }

    return [meat, fish];
  }

  async getInventory(type: InventoryType) {
    let inventory = await this.prisma.inventory.findUnique({
      where: { type },
      include: {
        logs: {
          orderBy: { date: "desc" },
          take: 20,
          include: {
            marketing: {
              select: {
                id: true,
                itemName: true,
                quantity: true,
                amount: true,
                shopName: true,
                date: true,
              },
            },
          },
        },
      },
    });

    if (!inventory) {
      inventory = await this.prisma.inventory.create({
        data: { type, quantity: 0 },
        include: {
          logs: {
            orderBy: { date: "desc" },
            take: 20,
            include: {
              marketing: {
                select: {
                  id: true,
                  itemName: true,
                  quantity: true,
                  amount: true,
                  shopName: true,
                  date: true,
                },
              },
            },
          },
        },
      });
    }

    return inventory;
  }

  async getSummary() {
    const meat = await this.getInventory(InventoryType.MEAT);
    const fish = await this.getInventory(InventoryType.FISH);

    return {
      meat: {
        available: meat.quantity,
        unit: "পিস",
        lastUpdated: meat.lastUpdated,
        logs: meat.logs?.slice(0, 5) || [],
      },
      fish: {
        available: fish.quantity,
        unit: "পিস",
        lastUpdated: fish.lastUpdated,
        logs: fish.logs?.slice(0, 5) || [],
      },
    };
  }

  async getLogs(type?: InventoryType) {
    const where: any = {};
    if (type) {
      const inventory = await this.prisma.inventory.findUnique({
        where: { type },
      });
      if (!inventory) {
        throw new NotFoundException(`Inventory for ${type} not found`);
      }
      where.inventoryId = inventory.id;
    }

    return this.prisma.inventoryLog.findMany({
      where,
      include: {
        inventory: true,
        marketing: {
          select: {
            id: true,
            itemName: true,
            quantity: true,
            amount: true,
            shopName: true,
            date: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  // ==================== ADD ====================

  async addInventory(addInventoryDto: AddInventoryDto) {
    const { type, quantity, marketingId, note } = addInventoryDto;

    if (quantity <= 0) {
      throw new BadRequestException("Quantity must be greater than 0");
    }

    // যদি marketingId দেওয়া থাকে, চেক করুন
    if (marketingId) {
      const marketing = await this.prisma.marketing.findUnique({
        where: { id: marketingId },
      });
      if (!marketing) {
        throw new NotFoundException(
          `Marketing with ID ${marketingId} not found`,
        );
      }
    }

    let inventory = await this.prisma.inventory.findUnique({
      where: { type },
    });

    if (!inventory) {
      inventory = await this.prisma.inventory.create({
        data: { type, quantity: 0 },
      });
    }

    const updated = await this.prisma.inventory.update({
      where: { type },
      data: {
        quantity: inventory.quantity + quantity,
        lastUpdated: new Date(),
      },
    });

    // লগ তৈরি করুন (marketingId সহ)
    await this.prisma.inventoryLog.create({
      data: {
        inventoryId: inventory.id,
        change: quantity,
        reason: "ADD",
        marketingId: marketingId || null,
        note: note || `${quantity} পিস যোগ করা হয়েছে`,
      },
    });

    return updated;
  }

  // ==================== REMOVE ====================

  async removeInventory(removeInventoryDto: RemoveInventoryDto) {
    const { type, quantity, note } = removeInventoryDto;

    if (quantity <= 0) {
      throw new BadRequestException("Quantity must be greater than 0");
    }

    const inventory = await this.prisma.inventory.findUnique({
      where: { type },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory for ${type} not found`);
    }

    if (inventory.quantity < quantity) {
      throw new BadRequestException(
        `Insufficient quantity. Available: ${inventory.quantity}, Requested: ${quantity}`,
      );
    }

    const updated = await this.prisma.inventory.update({
      where: { type },
      data: {
        quantity: inventory.quantity - quantity,
        lastUpdated: new Date(),
      },
    });

    await this.prisma.inventoryLog.create({
      data: {
        inventoryId: inventory.id,
        change: -quantity,
        reason: "REMOVE",
        note: note || `${quantity} পিস ব্যবহার করা হয়েছে`,
      },
    });

    return updated;
  }

  // ==================== SET (Manual) ====================

  async setInventory(setInventoryDto: SetInventoryDto) {
    const { type, quantity, note } = setInventoryDto;

    if (quantity < 0) {
      throw new BadRequestException("Quantity cannot be negative");
    }

    let inventory = await this.prisma.inventory.findUnique({
      where: { type },
    });

    if (!inventory) {
      inventory = await this.prisma.inventory.create({
        data: { type, quantity: 0 },
      });
    }

    const change = quantity - inventory.quantity;

    const updated = await this.prisma.inventory.update({
      where: { type },
      data: {
        quantity,
        lastUpdated: new Date(),
      },
    });

    if (change !== 0) {
      await this.prisma.inventoryLog.create({
        data: {
          inventoryId: inventory.id,
          change,
          reason: "MANUAL",
          note: note || `ম্যানুয়ালি সেট করা হয়েছে: ${quantity} পিস`,
        },
      });
    }

    return updated;
  }

  // ==================== CHECK AVAILABILITY ====================

  async checkAvailability(type: InventoryType, requiredQuantity: number) {
    const inventory = await this.getInventory(type);
    return {
      available: inventory.quantity >= requiredQuantity,
      availableQuantity: inventory.quantity,
      requiredQuantity,
      type,
    };
  }

  // ==================== BULK ====================

  async bulkAdd(
    items: {
      type: InventoryType;
      quantity: number;
      marketingId?: string;
      note?: string;
    }[],
  ) {
    const results = [];
    for (const item of items) {
      try {
        const result = await this.addInventory(item);
        results.push({ success: true, type: item.type, result });
      } catch (error) {
        // ✅ Type-safe error handling
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        results.push({ success: false, type: item.type, error: errorMessage });
      }
    }
    return results;
  }

  async bulkRemove(
    items: { type: InventoryType; quantity: number; note?: string }[],
  ) {
    const results = [];
    for (const item of items) {
      try {
        const result = await this.removeInventory(item);
        results.push({ success: true, type: item.type, result });
      } catch (error) {
        // ✅ Type-safe error handling
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        results.push({ success: false, type: item.type, error: errorMessage });
      }
    }
    return results;
  }
}
