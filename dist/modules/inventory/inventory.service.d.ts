import { PrismaService } from "../../prisma/prisma.service";
import { InventoryCategory } from "@prisma/client";
import { AddInventoryDto, RemoveInventoryDto, SetInventoryDto, CreateInventoryItemDto, UpdateInventoryItemDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class InventoryService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    getAllInventory(): Promise<Record<string, any[]>>;
    getSummary(): Promise<{
        totalItems: number;
        lowStockItems: number;
        categories: Record<string, any>;
    }>;
    getByCategory(category: InventoryCategory): Promise<{
        quantity: number;
        minStockLevel: number;
        purchasePrice: number;
        status: string;
        stockLogs: {
            id: string;
            date: Date;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            marketingId: string | null;
            inventoryItemId: string;
            change: import("@prisma/client/runtime/library").Decimal;
            previousQuantity: import("@prisma/client/runtime/library").Decimal;
            newQuantity: import("@prisma/client/runtime/library").Decimal;
            reason: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        unit: import(".prisma/client").$Enums.Unit;
        isActive: boolean;
        lastUpdated: Date;
        category: import(".prisma/client").$Enums.InventoryCategory;
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    getInventoryItem(itemName: string): Promise<{
        quantity: number;
        minStockLevel: number;
        purchasePrice: number;
        status: string;
        stockLogs: {
            id: string;
            date: Date;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            marketingId: string | null;
            inventoryItemId: string;
            change: import("@prisma/client/runtime/library").Decimal;
            previousQuantity: import("@prisma/client/runtime/library").Decimal;
            newQuantity: import("@prisma/client/runtime/library").Decimal;
            reason: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        unit: import(".prisma/client").$Enums.Unit;
        isActive: boolean;
        lastUpdated: Date;
        category: import(".prisma/client").$Enums.InventoryCategory;
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    createInventoryItem(dto: CreateInventoryItemDto): Promise<{
        quantity: number;
        minStockLevel: number;
        purchasePrice: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        unit: import(".prisma/client").$Enums.Unit;
        isActive: boolean;
        lastUpdated: Date;
        category: import(".prisma/client").$Enums.InventoryCategory;
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    updateInventoryItem(itemName: string, dto: UpdateInventoryItemDto): Promise<{
        quantity: number;
        minStockLevel: number;
        purchasePrice: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        unit: import(".prisma/client").$Enums.Unit;
        isActive: boolean;
        lastUpdated: Date;
        category: import(".prisma/client").$Enums.InventoryCategory;
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    addInventory(dto: AddInventoryDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        unit: import(".prisma/client").$Enums.Unit;
        isActive: boolean;
        lastUpdated: Date;
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
        unit: import(".prisma/client").$Enums.Unit;
        isActive: boolean;
        lastUpdated: Date;
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
        unit: import(".prisma/client").$Enums.Unit;
        isActive: boolean;
        lastUpdated: Date;
        category: import(".prisma/client").$Enums.InventoryCategory;
        purchasePrice: import("@prisma/client/runtime/library").Decimal | null;
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    getStockLogs(itemName?: string): Promise<({
        inventoryItem: {
            id: string;
            name: string;
            unit: import(".prisma/client").$Enums.Unit;
            category: import(".prisma/client").$Enums.InventoryCategory;
        };
    } & {
        id: string;
        date: Date;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        marketingId: string | null;
        inventoryItemId: string;
        change: import("@prisma/client/runtime/library").Decimal;
        previousQuantity: import("@prisma/client/runtime/library").Decimal;
        newQuantity: import("@prisma/client/runtime/library").Decimal;
        reason: string;
    })[]>;
    checkAvailability(itemName: string, requiredQuantity: number): Promise<{
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
    deleteInventoryItem(itemName: string): Promise<{
        message: string;
    }>;
    private sendLowStockAlert;
    private detectCategory;
}
