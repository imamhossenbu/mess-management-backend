import { InventoryCategory, Unit } from "@prisma/client";
export declare class CreateInventoryItemDto {
    name: string;
    category: InventoryCategory;
    unit: Unit;
    quantity: number;
    minStockLevel: number;
    purchasePrice?: number;
    sellingPrice?: number;
}
export declare class AddInventoryDto {
    itemName: string;
    quantity: number;
    unit: Unit;
    marketingItemId?: string;
    note?: string;
}
export declare class RemoveInventoryDto {
    itemName: string;
    quantity: number;
    note?: string;
}
export declare class SetInventoryDto {
    itemName: string;
    quantity: number;
    note?: string;
}
export declare class UpdateInventoryItemDto {
    name?: string;
    category?: InventoryCategory;
    unit?: Unit;
    minStockLevel?: number;
    purchasePrice?: number;
    sellingPrice?: number;
}
