// src/modules/inventory/inventory.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { InventoryType } from "@prisma/client";
import { AddInventoryDto, RemoveInventoryDto, SetInventoryDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ==================== GET ====================

  async getAllInventory(messId: string) {
    let meat = await this.prisma.inventory.findUnique({
      where: {
        messId_type: {
          messId,
          type: InventoryType.MEAT,
        },
      },
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
      where: {
        messId_type: {
          messId,
          type: InventoryType.FISH,
        },
      },
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
        data: { messId, type: InventoryType.MEAT, quantity: 0 },
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
        data: { messId, type: InventoryType.FISH, quantity: 0 },
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

    // Get meat with logs
    const meatWithLogs = await this.prisma.inventory.findUnique({
      where: {
        messId_type: {
          messId,
          type: InventoryType.MEAT,
        },
      },
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

    const fishWithLogs = await this.prisma.inventory.findUnique({
      where: {
        messId_type: {
          messId,
          type: InventoryType.FISH,
        },
      },
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

    return [meatWithLogs || meat, fishWithLogs || fish];
  }

  async getInventory(messId: string, type: InventoryType) {
    let inventory = await this.prisma.inventory.findUnique({
      where: {
        messId_type: {
          messId,
          type,
        },
      },
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
        data: { messId, type, quantity: 0 },
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

    // Get inventory with logs
    const inventoryWithLogs = await this.prisma.inventory.findUnique({
      where: {
        messId_type: {
          messId,
          type,
        },
      },
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

    return inventoryWithLogs || inventory;
  }

  async getSummary(messId: string) {
    const meat = await this.getInventory(messId, InventoryType.MEAT);
    const fish = await this.getInventory(messId, InventoryType.FISH);

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

  async getLogs(messId: string, type?: InventoryType) {
    const where: any = { messId };

    if (type) {
      const inventory = await this.prisma.inventory.findUnique({
        where: {
          messId_type: {
            messId,
            type,
          },
        },
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

  async addInventory(messId: string, addInventoryDto: AddInventoryDto) {
    const { type, quantity, marketingId, note } = addInventoryDto;

    if (quantity <= 0) {
      throw new BadRequestException("Quantity must be greater than 0");
    }

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
      where: {
        messId_type: {
          messId,
          type,
        },
      },
    });

    if (!inventory) {
      inventory = await this.prisma.inventory.create({
        data: { messId, type, quantity: 0 },
      });
    }

    const updated = await this.prisma.inventory.update({
      where: {
        messId_type: {
          messId,
          type,
        },
      },
      data: {
        quantity: inventory.quantity + quantity,
        lastUpdated: new Date(),
      },
    });

    await this.prisma.inventoryLog.create({
      data: {
        messId,
        inventoryId: inventory.id,
        change: quantity,
        reason: "ADD",
        marketingId: marketingId || null,
        note: note || `${quantity} পিস যোগ করা হয়েছে`,
      },
    });

    const updatedInventory = await this.getInventory(messId, type);
    if (updatedInventory.quantity > 50) {
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

  async removeInventory(
    messId: string,
    removeInventoryDto: RemoveInventoryDto,
  ) {
    const { type, quantity, note } = removeInventoryDto;

    if (quantity <= 0) {
      throw new BadRequestException("Quantity must be greater than 0");
    }

    const inventory = await this.prisma.inventory.findUnique({
      where: {
        messId_type: {
          messId,
          type,
        },
      },
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
      where: {
        messId_type: {
          messId,
          type,
        },
      },
      data: {
        quantity: inventory.quantity - quantity,
        lastUpdated: new Date(),
      },
    });

    await this.prisma.inventoryLog.create({
      data: {
        messId,
        inventoryId: inventory.id,
        change: -quantity,
        reason: "REMOVE",
        note: note || `${quantity} পিস ব্যবহার করা হয়েছে`,
      },
    });

    const updatedInventory = await this.getInventory(messId, type);
    if (updatedInventory.quantity < 10) {
      await this.notificationsService.sendInventoryAlert(
        type,
        updatedInventory.quantity,
      );
    }

    return updated;
  }

  // ==================== SET (Manual) ====================

  async setInventory(messId: string, setInventoryDto: SetInventoryDto) {
    const { type, quantity, note } = setInventoryDto;

    if (quantity < 0) {
      throw new BadRequestException("Quantity cannot be negative");
    }

    let inventory = await this.prisma.inventory.findUnique({
      where: {
        messId_type: {
          messId,
          type,
        },
      },
    });

    if (!inventory) {
      inventory = await this.prisma.inventory.create({
        data: { messId, type, quantity: 0 },
      });
    }

    const change = quantity - inventory.quantity;

    const updated = await this.prisma.inventory.update({
      where: {
        messId_type: {
          messId,
          type,
        },
      },
      data: {
        quantity,
        lastUpdated: new Date(),
      },
    });

    if (change !== 0) {
      await this.prisma.inventoryLog.create({
        data: {
          messId,
          inventoryId: inventory.id,
          change,
          reason: "MANUAL",
          note: note || `ম্যানুয়ালি সেট করা হয়েছে: ${quantity} পিস`,
        },
      });
    }

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
        type: "INVENTORY",
        title: "Inventory Manually Updated",
        message: `${type} stock has been manually set to ${quantity} pieces.`,
        link: "/inventory",
      });
    }

    if (quantity < 10) {
      await this.notificationsService.sendInventoryAlert(type, quantity);
    }

    return updated;
  }

  // ==================== CHECK AVAILABILITY ====================

  async checkAvailability(
    messId: string,
    type: InventoryType,
    requiredQuantity: number,
  ) {
    const inventory = await this.getInventory(messId, type);
    const isAvailable = inventory.quantity >= requiredQuantity;

    if (!isAvailable) {
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
    messId: string,
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
        const result = await this.addInventory(messId, item);
        results.push({ success: true, type: item.type, result });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        results.push({ success: false, type: item.type, error: errorMessage });
      }
    }

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

    const successCount = results.filter((r) => r.success).length;
    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.userId,
        type: "INVENTORY",
        title: "Bulk Inventory Add",
        message: `${successCount} items added to inventory successfully.`,
        link: "/inventory",
      });
    }

    return results;
  }

  async bulkRemove(
    messId: string,
    items: { type: InventoryType; quantity: number; note?: string }[],
  ) {
    const results = [];
    for (const item of items) {
      try {
        const result = await this.removeInventory(messId, item);
        results.push({ success: true, type: item.type, result });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        results.push({ success: false, type: item.type, error: errorMessage });
      }
    }

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

    const successCount = results.filter((r) => r.success).length;
    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.userId,
        type: "INVENTORY",
        title: "Bulk Inventory Remove",
        message: `${successCount} items removed from inventory successfully.`,
        link: "/inventory",
      });
    }

    return results;
  }
}
