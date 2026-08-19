import { InventoryCategory } from "@prisma/client";
export declare class InventoryItemResponseDto {
    id: string;
    name: string;
    category: InventoryCategory;
    quantity: number;
    minStockLevel: number;
    lastUpdated: Date;
    status: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class InventoryLogResponseDto {
    id: string;
    inventoryItemId: string;
    change: number;
    previousQuantity: number;
    newQuantity: number;
    reason: string;
    note?: string;
    date: Date;
    createdAt: Date;
    inventoryItem?: {
        id: string;
        name: string;
        category: InventoryCategory;
    };
}
export declare class InventorySummaryDto {
    totalItems: number;
    lowStockItems: number;
    categories: Record<string, {
        items: InventoryItemResponseDto[];
        totalItems: number;
        lowStockItems: number;
    }>;
}
