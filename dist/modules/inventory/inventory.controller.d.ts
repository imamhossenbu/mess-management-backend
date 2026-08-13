import { InventoryService } from "./inventory.service";
import { AddInventoryDto, RemoveInventoryDto, SetInventoryDto } from "./dto";
import { InventoryType } from "@prisma/client";
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getAll(messId: string): Promise<any[]>;
    getSummary(messId: string): Promise<{
        meat: {
            available: any;
            unit: string;
            lastUpdated: any;
            logs: any;
        };
        fish: {
            available: any;
            unit: string;
            lastUpdated: any;
            logs: any;
        };
    }>;
    getByType(messId: string, type: InventoryType): Promise<any>;
    getLogs(messId: string, type?: InventoryType): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        note: string | null;
        inventoryItemId: string;
        change: import("@prisma/client/runtime/library").Decimal;
        previousQuantity: import("@prisma/client/runtime/library").Decimal;
        newQuantity: import("@prisma/client/runtime/library").Decimal;
        reason: string;
        marketingItemId: string | null;
    }[]>;
    checkAvailability(messId: string, type: InventoryType, quantity: number): Promise<{
        available: boolean;
        availableQuantity: any;
        requiredQuantity: number;
        type: InventoryType;
    }>;
    add(messId: string, addInventoryDto: AddInventoryDto): Promise<any>;
    remove(messId: string, removeInventoryDto: RemoveInventoryDto): Promise<any>;
    set(messId: string, setInventoryDto: SetInventoryDto): Promise<any>;
    bulkAdd(messId: string, items: {
        type: InventoryType;
        quantity: number;
        marketingId?: string;
        note?: string;
    }[]): Promise<any[]>;
    bulkRemove(messId: string, items: {
        type: InventoryType;
        quantity: number;
        note?: string;
    }[]): Promise<any[]>;
}
