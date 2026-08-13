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
const notifications_service_1 = require("../notifications/notifications.service");
let InventoryService = class InventoryService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
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
        const grouped = inventoryItems.reduce((acc, item) => {
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
                status: Number(item.quantity) <= Number(item.minStockLevel) &&
                    Number(item.minStockLevel) > 0
                    ? "LOW_STOCK"
                    : "OK",
            });
            return acc;
        }, {});
        return grouped;
    }
    async getSummary() {
        const inventoryItems = await this.prisma.inventoryItem.findMany();
        const categories = inventoryItems.reduce((acc, item) => {
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
            if (Number(item.quantity) <= Number(item.minStockLevel) &&
                Number(item.minStockLevel) > 0) {
                acc[category].lowStockItems++;
            }
            return acc;
        }, {});
        const totalItems = inventoryItems.length;
        const lowStockItems = inventoryItems.filter((item) => Number(item.quantity) <= Number(item.minStockLevel) &&
            Number(item.minStockLevel) > 0).length;
        return {
            totalItems,
            lowStockItems,
            categories,
        };
    }
    async getByCategory(category) {
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
            status: Number(item.quantity) <= Number(item.minStockLevel) &&
                Number(item.minStockLevel) > 0
                ? "LOW_STOCK"
                : "OK",
        }));
    }
    async getInventoryItem(itemName) {
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
            throw new common_1.NotFoundException(`Inventory item "${itemName}" not found`);
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
    async createInventoryItem(dto) {
        const existing = await this.prisma.inventoryItem.findFirst({
            where: {
                name: dto.name,
                category: dto.category,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Item "${dto.name}" already exists in ${dto.category}`);
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
    async updateInventoryItem(itemName, dto) {
        const item = await this.prisma.inventoryItem.findFirst({
            where: { name: itemName },
        });
        if (!item) {
            throw new common_1.NotFoundException(`Inventory item "${itemName}" not found`);
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
    async addInventory(dto) {
        const { itemName, quantity, unit, marketingItemId, note } = dto;
        if (quantity <= 0) {
            throw new common_1.BadRequestException("Quantity must be greater than 0");
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
        if (marketingItemId) {
            await this.prisma.marketingItem.update({
                where: { id: marketingItemId },
                data: {
                    addedToInventory: true,
                },
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
    async removeInventory(dto) {
        const { itemName, quantity, note } = dto;
        if (quantity <= 0) {
            throw new common_1.BadRequestException("Quantity must be greater than 0");
        }
        const item = await this.prisma.inventoryItem.findFirst({
            where: { name: itemName },
        });
        if (!item) {
            throw new common_1.NotFoundException(`Inventory item "${itemName}" not found`);
        }
        const currentQuantity = Number(item.quantity);
        if (currentQuantity < quantity) {
            throw new common_1.BadRequestException(`Insufficient quantity. Available: ${currentQuantity}, Requested: ${quantity}`);
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
        if (newQuantity <= Number(item.minStockLevel)) {
            await this.sendLowStockAlert(item.name, newQuantity);
        }
        return {
            ...updated,
            quantity: Number(updated.quantity),
            minStockLevel: Number(updated.minStockLevel),
        };
    }
    async setInventory(dto) {
        const { itemName, quantity, note } = dto;
        if (quantity < 0) {
            throw new common_1.BadRequestException("Quantity cannot be negative");
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
    async getStockLogs(itemName) {
        if (itemName) {
            const item = await this.prisma.inventoryItem.findFirst({
                where: { name: itemName },
            });
            if (!item) {
                throw new common_1.NotFoundException(`Inventory item "${itemName}" not found`);
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
    async checkAvailability(itemName, requiredQuantity) {
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
    async sendLowStockAlert(itemName, quantity) {
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
    detectCategory(name) {
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
        if (fishKeywords.some((k) => nameLower.includes(k)))
            return "FISH";
        if (meatKeywords.some((k) => nameLower.includes(k)))
            return "MEAT";
        if (vegetableKeywords.some((k) => nameLower.includes(k)))
            return "VEGETABLE";
        if (riceKeywords.some((k) => nameLower.includes(k)))
            return "RICE";
        if (oilKeywords.some((k) => nameLower.includes(k)))
            return "OIL";
        if (spiceKeywords.some((k) => nameLower.includes(k)))
            return "SPICE";
        if (dairyKeywords.some((k) => nameLower.includes(k)))
            return "DAIRY";
        if (fruitKeywords.some((k) => nameLower.includes(k)))
            return "FRUIT";
        return "OTHER";
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map