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
    getInventoryItem(itemName: string): Promise<{
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
    createInventoryItem(dto: CreateInventoryItemDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        name: string;
        category: import(".prisma/client").$Enums.InventoryCategory;
        lastUpdated: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateInventoryItem(itemName: string, dto: UpdateInventoryItemDto): Promise<{
        quantity: number;
        minStockLevel: number;
        id: string;
        name: string;
        category: import(".prisma/client").$Enums.InventoryCategory;
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
    })[]>;
    checkAvailability(itemName: string, requiredQuantity: number): Promise<{
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
    deleteInventoryItem(itemName: string): Promise<{
        message: string;
    }>;
    private sendLowStockAlert;
    private detectCategory;
}
