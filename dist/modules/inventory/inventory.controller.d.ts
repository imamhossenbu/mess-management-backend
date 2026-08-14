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
            updatedAt: Date;
            date: Date;
            inventoryItemId: string;
            change: import("@prisma/client/runtime/library").Decimal;
            previousQuantity: import("@prisma/client/runtime/library").Decimal;
            newQuantity: import("@prisma/client/runtime/library").Decimal;
            reason: string;
            note: string | null;
            marketingId: string | null;
        }[];
        id: string;
        name: string;
        category: import(".prisma/client").$Enums.InventoryCategory;
        unit: import(".prisma/client").$Enums.Unit;
        lastUpdated: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getInventoryItem(name: string): Promise<{
        quantity: number;
        minStockLevel: number;
        purchasePrice: number;
        sellingPrice: number;
        status: string;
        stockLogs: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            inventoryItemId: string;
            change: import("@prisma/client/runtime/library").Decimal;
            previousQuantity: import("@prisma/client/runtime/library").Decimal;
            newQuantity: import("@prisma/client/runtime/library").Decimal;
            reason: string;
            note: string | null;
            marketingId: string | null;
        }[];
        id: string;
        name: string;
        category: import(".prisma/client").$Enums.InventoryCategory;
        unit: import(".prisma/client").$Enums.Unit;
        lastUpdated: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getStockLogs(itemName?: string): Promise<({
        inventoryItem: {
            id: string;
            name: string;
            category: import(".prisma/client").$Enums.InventoryCategory;
            unit: import(".prisma/client").$Enums.Unit;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        inventoryItemId: string;
        change: import("@prisma/client/runtime/library").Decimal;
        previousQuantity: import("@prisma/client/runtime/library").Decimal;
        newQuantity: import("@prisma/client/runtime/library").Decimal;
        reason: string;
        note: string | null;
        marketingId: string | null;
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
        name: string;
        category: import(".prisma/client").$Enums.InventoryCategory;
        unit: import(".prisma/client").$Enums.Unit;
        lastUpdated: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateInventoryItem(name: string, dto: UpdateInventoryItemDto): Promise<{
        quantity: number;
        minStockLevel: number;
        purchasePrice: number;
        sellingPrice: number;
        id: string;
        name: string;
        category: import(".prisma/client").$Enums.InventoryCategory;
        unit: import(".prisma/client").$Enums.Unit;
        lastUpdated: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addInventory(dto: AddInventoryDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        name: string;
        category: import(".prisma/client").$Enums.InventoryCategory;
        unit: import(".prisma/client").$Enums.Unit;
        purchasePrice: import("@prisma/client/runtime/library").Decimal | null;
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
        lastUpdated: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeInventory(dto: RemoveInventoryDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        name: string;
        category: import(".prisma/client").$Enums.InventoryCategory;
        unit: import(".prisma/client").$Enums.Unit;
        purchasePrice: import("@prisma/client/runtime/library").Decimal | null;
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
        lastUpdated: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setInventory(dto: SetInventoryDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        name: string;
        category: import(".prisma/client").$Enums.InventoryCategory;
        unit: import(".prisma/client").$Enums.Unit;
        purchasePrice: import("@prisma/client/runtime/library").Decimal | null;
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
        lastUpdated: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteInventoryItem(name: string): Promise<{
        message: string;
    }>;
}
