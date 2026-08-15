import { InventoryCategory, Unit } from "@prisma/client";
export declare class InventoryItemResponseDto {
    id: string;
    name: string;
    category: InventoryCategory;
    unit: Unit;
    quantity: number;
    minStockLevel: number;
    purchasePrice?: number;
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
    marketingId?: string;
    date: Date;
    createdAt: Date;
    inventoryItem?: {
        id: string;
        name: string;
        category: InventoryCategory;
        unit: Unit;
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
export declare class InventoryCategorySummaryDto {
    category: InventoryCategory;
    totalItems: number;
    totalQuantity: number;
    lowStockItems: number;
}
