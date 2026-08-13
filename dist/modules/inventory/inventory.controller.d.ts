import { InventoryService } from "./inventory.service";
import { AddInventoryDto, RemoveInventoryDto, SetInventoryDto, CreateInventoryItemDto, UpdateInventoryItemDto } from "./dto";
import { InventoryCategory } from "@prisma/client";
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getAll(): Promise<Record<string, any[]>>;
    getSummary(): Promise<{
        totalItems: number;
        lowStockItems: number;
        categories: Record<string, any>;
    }>;
    getByCategory(category: InventoryCategory): Promise<{
        quantity: number;
        minStockLevel: number;
        purchasePrice: number;
        sellingPrice: number;
        status: string;
        stockLogs: {
            id: string;
            createdAt: Date;
            date: Date;
            note: string | null;
            inventoryItemId: string;
            change: import("@prisma/client/runtime/library").Decimal;
            previousQuantity: import("@prisma/client/runtime/library").Decimal;
            newQuantity: import("@prisma/client/runtime/library").Decimal;
            reason: string;
            marketingItemId: string | null;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        lastUpdated: Date;
        unit: import(".prisma/client").$Enums.Unit;
        category: import(".prisma/client").$Enums.InventoryCategory;
    }[]>;
    getInventoryItem(name: string): Promise<{
        quantity: number;
        minStockLevel: number;
        purchasePrice: number;
        sellingPrice: number;
        stockLogs: ({
            marketingItem: {
                marketing: {
                    id: string;
                    date: Date;
                    shopName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: import("@prisma/client/runtime/library").Decimal;
                note: string | null;
                itemName: string;
                unit: import(".prisma/client").$Enums.Unit;
                price: import("@prisma/client/runtime/library").Decimal;
                totalPrice: import("@prisma/client/runtime/library").Decimal;
                addedToInventory: boolean;
                inventoryItemId: string | null;
                marketingId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            date: Date;
            note: string | null;
            inventoryItemId: string;
            change: import("@prisma/client/runtime/library").Decimal;
            previousQuantity: import("@prisma/client/runtime/library").Decimal;
            newQuantity: import("@prisma/client/runtime/library").Decimal;
            reason: string;
            marketingItemId: string | null;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        lastUpdated: Date;
        unit: import(".prisma/client").$Enums.Unit;
        category: import(".prisma/client").$Enums.InventoryCategory;
    }>;
    getStockLogs(itemName?: string): Promise<({
        inventoryItem: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            quantity: import("@prisma/client/runtime/library").Decimal;
            lastUpdated: Date;
            unit: import(".prisma/client").$Enums.Unit;
            category: import(".prisma/client").$Enums.InventoryCategory;
            minStockLevel: import("@prisma/client/runtime/library").Decimal;
            purchasePrice: import("@prisma/client/runtime/library").Decimal | null;
            sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
        marketingItem: {
            marketing: {
                id: string;
                date: Date;
                shopName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            itemName: string;
            unit: import(".prisma/client").$Enums.Unit;
            price: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            addedToInventory: boolean;
            inventoryItemId: string | null;
            marketingId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        date: Date;
        note: string | null;
        inventoryItemId: string;
        change: import("@prisma/client/runtime/library").Decimal;
        previousQuantity: import("@prisma/client/runtime/library").Decimal;
        newQuantity: import("@prisma/client/runtime/library").Decimal;
        reason: string;
        marketingItemId: string | null;
    })[]>;
    checkAvailability(name: string, quantity: number): Promise<{
        available: boolean;
        availableQuantity: number;
        requiredQuantity: number;
        itemName: string;
        message: string;
        unit?: undefined;
    } | {
        available: boolean;
        availableQuantity: number;
        requiredQuantity: number;
        itemName: string;
        unit: import(".prisma/client").$Enums.Unit;
        message?: undefined;
    }>;
    createInventoryItem(dto: CreateInventoryItemDto): Promise<{
        quantity: number;
        minStockLevel: number;
        purchasePrice: number;
        sellingPrice: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        lastUpdated: Date;
        unit: import(".prisma/client").$Enums.Unit;
        category: import(".prisma/client").$Enums.InventoryCategory;
    }>;
    updateInventoryItem(name: string, dto: UpdateInventoryItemDto): Promise<{
        quantity: number;
        minStockLevel: number;
        purchasePrice: number;
        sellingPrice: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        lastUpdated: Date;
        unit: import(".prisma/client").$Enums.Unit;
        category: import(".prisma/client").$Enums.InventoryCategory;
    }>;
    addInventory(dto: AddInventoryDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        lastUpdated: Date;
        unit: import(".prisma/client").$Enums.Unit;
        category: import(".prisma/client").$Enums.InventoryCategory;
        purchasePrice: import("@prisma/client/runtime/library").Decimal | null;
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    removeInventory(dto: RemoveInventoryDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        lastUpdated: Date;
        unit: import(".prisma/client").$Enums.Unit;
        category: import(".prisma/client").$Enums.InventoryCategory;
        purchasePrice: import("@prisma/client/runtime/library").Decimal | null;
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    setInventory(dto: SetInventoryDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        lastUpdated: Date;
        unit: import(".prisma/client").$Enums.Unit;
        category: import(".prisma/client").$Enums.InventoryCategory;
        purchasePrice: import("@prisma/client/runtime/library").Decimal | null;
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    deleteInventoryItem(name: string): Promise<void>;
}
