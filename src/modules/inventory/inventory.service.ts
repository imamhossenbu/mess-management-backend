// src/modules/inventory/inventory.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { InventoryType } from "@prisma/client";
import { AddInventoryDto, RemoveInventoryDto, SetInventoryDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service"; // ✅ Import

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService, // ✅ Inject
  ) {}

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

    // ✅ Check if stock is high after adding (notification for admins)
    const updatedInventory = await this.getInventory(type);
    if (updatedInventory.quantity > 50) {
      const admins = await this.prisma.user.findMany({
        where: {
          role: { in: ["SUPER_ADMIN", "MANAGER"] },
          isActive: true,
        },
      });

      for (const admin of admins) {
        await this.notificationsService.create({
          userId: admin.id,
          type: "INVENTORY",
          title: "Stock Level High",
          message: `${type} stock is now ${updatedInventory.quantity} pieces. Consider reducing purchases.`,
          link: "/inventory",
        });
      }
    }

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

    // ✅ Check if stock is low after removing
    const updatedInventory = await this.getInventory(type);
    if (updatedInventory.quantity < 10) {
      await this.notificationsService.sendInventoryAlert(
        type,
        updatedInventory.quantity,
      );
    }

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

    // ✅ Send notification for manual update
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "MANAGER"] },
        isActive: true,
      },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "INVENTORY",
        title: "Inventory Manually Updated",
        message: `${type} stock has been manually set to ${quantity} pieces.`,
        link: "/inventory",
      });
    }

    // ✅ Check if stock is low after manual update
    if (quantity < 10) {
      await this.notificationsService.sendInventoryAlert(type, quantity);
    }

    return updated;
  }

  // ==================== CHECK AVAILABILITY ====================

  async checkAvailability(type: InventoryType, requiredQuantity: number) {
    const inventory = await this.getInventory(type);
    const isAvailable = inventory.quantity >= requiredQuantity;

    // ✅ Send notification if checking low stock
    if (!isAvailable) {
      const admins = await this.prisma.user.findMany({
        where: {
          role: { in: ["SUPER_ADMIN", "MANAGER"] },
          isActive: true,
        },
      });

      for (const admin of admins) {
        await this.notificationsService.create({
          userId: admin.id,
          type: "INVENTORY",
          title: "Stock Check Alert",
          message: `${type} stock check failed. Required: ${requiredQuantity}, Available: ${inventory.quantity}`,
          link: "/inventory",
        });
      }
    }

    return {
      available: isAvailable,
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

    // ✅ Send bulk add notification to admins
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "MANAGER"] },
        isActive: true,
      },
    });

    const successCount = results.filter((r) => r.success).length;
    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "INVENTORY",
        title: "Bulk Inventory Add",
        message: `${successCount} items added to inventory successfully.`,
        link: "/inventory",
      });
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

    // ✅ Send bulk remove notification to admins
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "MANAGER"] },
        isActive: true,
      },
    });

    const successCount = results.filter((r) => r.success).length;
    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "INVENTORY",
        title: "Bulk Inventory Remove",
        message: `${successCount} items removed from inventory successfully.`,
        link: "/inventory",
      });
    }

    return results;
  }
}
