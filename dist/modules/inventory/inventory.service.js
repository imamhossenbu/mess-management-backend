"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
let InventoryService = class InventoryService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async getAllInventory() {
        let meat = await this.prisma.inventory.findUnique({
            where: { type: client_1.InventoryType.MEAT },
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
            where: { type: client_1.InventoryType.FISH },
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
                data: { type: client_1.InventoryType.MEAT, quantity: 0 },
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
                data: { type: client_1.InventoryType.FISH, quantity: 0 },
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
    async getInventory(type) {
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
        const meat = await this.getInventory(client_1.InventoryType.MEAT);
        const fish = await this.getInventory(client_1.InventoryType.FISH);
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
    async getLogs(type) {
        const where = {};
        if (type) {
            const inventory = await this.prisma.inventory.findUnique({
                where: { type },
            });
            if (!inventory) {
                throw new common_1.NotFoundException(`Inventory for ${type} not found`);
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
    async addInventory(addInventoryDto) {
        const { type, quantity, marketingId, note } = addInventoryDto;
        if (quantity <= 0) {
            throw new common_1.BadRequestException("Quantity must be greater than 0");
        }
        if (marketingId) {
            const marketing = await this.prisma.marketing.findUnique({
                where: { id: marketingId },
            });
            if (!marketing) {
                throw new common_1.NotFoundException(`Marketing with ID ${marketingId} not found`);
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
        await this.prisma.inventoryLog.create({
            data: {
                inventoryId: inventory.id,
                change: quantity,
                reason: "ADD",
                marketingId: marketingId || null,
                note: note || `${quantity} পিস যোগ করা হয়েছে`,
            },
        });
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
    async removeInventory(removeInventoryDto) {
        const { type, quantity, note } = removeInventoryDto;
        if (quantity <= 0) {
            throw new common_1.BadRequestException("Quantity must be greater than 0");
        }
        const inventory = await this.prisma.inventory.findUnique({
            where: { type },
        });
        if (!inventory) {
            throw new common_1.NotFoundException(`Inventory for ${type} not found`);
        }
        if (inventory.quantity < quantity) {
            throw new common_1.BadRequestException(`Insufficient quantity. Available: ${inventory.quantity}, Requested: ${quantity}`);
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
        const updatedInventory = await this.getInventory(type);
        if (updatedInventory.quantity < 10) {
            await this.notificationsService.sendInventoryAlert(type, updatedInventory.quantity);
        }
        return updated;
    }
    async setInventory(setInventoryDto) {
        const { type, quantity, note } = setInventoryDto;
        if (quantity < 0) {
            throw new common_1.BadRequestException("Quantity cannot be negative");
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
        if (quantity < 10) {
            await this.notificationsService.sendInventoryAlert(type, quantity);
        }
        return updated;
    }
    async checkAvailability(type, requiredQuantity) {
        const inventory = await this.getInventory(type);
        const isAvailable = inventory.quantity >= requiredQuantity;
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
    async bulkAdd(items) {
        const results = [];
        for (const item of items) {
            try {
                const result = await this.addInventory(item);
                results.push({ success: true, type: item.type, result });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                results.push({ success: false, type: item.type, error: errorMessage });
            }
        }
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
    async bulkRemove(items) {
        const results = [];
        for (const item of items) {
            try {
                const result = await this.removeInventory(item);
                results.push({ success: true, type: item.type, result });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                results.push({ success: false, type: item.type, error: errorMessage });
            }
        }
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
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map