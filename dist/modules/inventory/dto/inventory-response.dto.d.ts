import { InventoryType } from '@prisma/client';
export declare class InventoryResponseDto {
    id: string;
    type: InventoryType;
    quantity: number;
    lastUpdated: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class InventoryLogResponseDto {
    id: string;
    inventoryId: string;
    change: number;
    reason: string;
    marketingId?: string;
    note?: string;
    date: Date;
    createdAt: Date;
    marketing?: {
        id: string;
        itemName: string;
        quantity: string;
        amount: number;
        shopName: string;
        date: Date;
    };
}
export declare class InventorySummaryDto {
    meat: {
        available: number;
        unit: string;
        lastUpdated: Date;
        logs?: InventoryLogResponseDto[];
    };
    fish: {
        available: number;
        unit: string;
        lastUpdated: Date;
        logs?: InventoryLogResponseDto[];
    };
}
