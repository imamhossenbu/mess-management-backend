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
        id: string;
        name: string;
        category: import(".prisma/client").$Enums.InventoryCategory;
        quantity: number;
        minStockLevel: number;
        lastUpdated: Date;
        isActive: boolean;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getInventoryItem(name: string): Promise<{
        id: string;
        name: string;
        category: import(".prisma/client").$Enums.InventoryCategory;
        quantity: number;
        minStockLevel: number;
        lastUpdated: Date;
        isActive: boolean;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        logs: {
            id: string;
            change: number;
            previousQuantity: number;
            newQuantity: number;
            reason: string;
            note: string;
            date: Date;
            createdAt: Date;
        }[];
    }>;
    getStockLogs(itemName?: string): Promise<({
        inventoryItem: {
            id: string;
            name: string;
            category: import(".prisma/client").$Enums.InventoryCategory;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        note: string | null;
        inventoryItemId: string;
        change: import("@prisma/client/runtime/library").Decimal;
        previousQuantity: import("@prisma/client/runtime/library").Decimal;
        newQuantity: import("@prisma/client/runtime/library").Decimal;
        reason: string;
    })[]>;
    checkAvailability(name: string, quantity: number): Promise<{
        available: boolean;
        availableQuantity: number;
        requiredQuantity: number;
        itemName: string;
        message: string;
    } | {
        available: boolean;
        availableQuantity: number;
        requiredQuantity: number;
        itemName: string;
        message?: undefined;
    }>;
    createInventoryItem(dto: CreateInventoryItemDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        lastUpdated: Date;
        category: import(".prisma/client").$Enums.InventoryCategory;
    }>;
    updateInventoryItem(name: string, dto: UpdateInventoryItemDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        lastUpdated: Date;
        category: import(".prisma/client").$Enums.InventoryCategory;
    }>;
    addInventory(dto: AddInventoryDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        lastUpdated: Date;
        category: import(".prisma/client").$Enums.InventoryCategory;
    }>;
    removeInventory(dto: RemoveInventoryDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        lastUpdated: Date;
        category: import(".prisma/client").$Enums.InventoryCategory;
    }>;
    setInventory(dto: SetInventoryDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        lastUpdated: Date;
        category: import(".prisma/client").$Enums.InventoryCategory;
    }>;
    deleteInventoryItem(name: string): Promise<{
        message: string;
    }>;
}
