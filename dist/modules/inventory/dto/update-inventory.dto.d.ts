import { InventoryType } from '@prisma/client';
export declare class AddInventoryDto {
    type: InventoryType;
    quantity: number;
    marketingId?: string;
    note?: string;
}
export declare class RemoveInventoryDto {
    type: InventoryType;
    quantity: number;
    note?: string;
}
export declare class SetInventoryDto {
    type: InventoryType;
    quantity: number;
    note?: string;
}
