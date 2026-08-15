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
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
        lastUpdated: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getInventoryItem(itemName: string): Promise<{
        quantity: number;
        minStockLevel: number;
        purchasePrice: number;
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
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
        lastUpdated: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createInventoryItem(dto: CreateInventoryItemDto): Promise<{
        quantity: number;
        minStockLevel: number;
        purchasePrice: number;
        id: string;
        name: string;
        category: import(".prisma/client").$Enums.InventoryCategory;
        unit: import(".prisma/client").$Enums.Unit;
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
        lastUpdated: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateInventoryItem(itemName: string, dto: UpdateInventoryItemDto): Promise<{
        quantity: number;
        minStockLevel: number;
        purchasePrice: number;
        id: string;
        name: string;
        category: import(".prisma/client").$Enums.InventoryCategory;
        unit: import(".prisma/client").$Enums.Unit;
        sellingPrice: import("@prisma/client/runtime/library").Decimal | null;
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
