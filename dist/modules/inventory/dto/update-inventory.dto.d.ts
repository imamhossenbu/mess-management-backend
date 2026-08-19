import { InventoryCategory } from "@prisma/client";
export declare class CreateInventoryItemDto {
    name: string;
    category: InventoryCategory;
    initialQuantity: number;
    minStockLevel: number;
}
export declare class AddInventoryDto {
    itemName: string;
    quantity: number;
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
    minStockLevel?: number;
    isActive?: boolean;
}
