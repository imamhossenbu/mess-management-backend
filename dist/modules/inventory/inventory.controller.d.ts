import { InventoryService } from "./inventory.service";
import { AddInventoryDto, RemoveInventoryDto, SetInventoryDto } from "./dto";
import { InventoryType } from "@prisma/client";
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getAll(): Promise<({
        logs: ({
            marketing: {
                id: string;
                quantity: string;
                date: Date;
                itemName: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                shopName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            date: Date;
            inventoryId: string;
            change: number;
            reason: string;
            marketingId: string | null;
            note: string | null;
        })[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getSummary(): Promise<{
        meat: {
            available: number;
            unit: string;
            lastUpdated: Date;
            logs: ({
                marketing: {
                    id: string;
                    quantity: string;
                    date: Date;
                    itemName: string;
                    amount: import("@prisma/client/runtime/library").Decimal;
                    shopName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                date: Date;
                inventoryId: string;
                change: number;
                reason: string;
                marketingId: string | null;
                note: string | null;
            })[];
        };
        fish: {
            available: number;
            unit: string;
            lastUpdated: Date;
            logs: ({
                marketing: {
                    id: string;
                    quantity: string;
                    date: Date;
                    itemName: string;
                    amount: import("@prisma/client/runtime/library").Decimal;
                    shopName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                date: Date;
                inventoryId: string;
                change: number;
                reason: string;
                marketingId: string | null;
                note: string | null;
            })[];
        };
    }>;
    getByType(type: InventoryType): Promise<{
        logs: ({
            marketing: {
                id: string;
                quantity: string;
                date: Date;
                itemName: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                shopName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            date: Date;
            inventoryId: string;
            change: number;
            reason: string;
            marketingId: string | null;
            note: string | null;
        })[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getLogs(type?: InventoryType): Promise<({
        inventory: {
            id: string;
            type: import(".prisma/client").$Enums.InventoryType;
            quantity: number;
            lastUpdated: Date;
            createdAt: Date;
            updatedAt: Date;
        };
        marketing: {
            id: string;
            quantity: string;
            date: Date;
            itemName: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            shopName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        date: Date;
        inventoryId: string;
        change: number;
        reason: string;
        marketingId: string | null;
        note: string | null;
    })[]>;
    checkAvailability(type: InventoryType, quantity: number): Promise<{
        available: boolean;
        availableQuantity: number;
        requiredQuantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    }>;
    add(addInventoryDto: AddInventoryDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(removeInventoryDto: RemoveInventoryDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    set(setInventoryDto: SetInventoryDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    bulkAdd(items: {
        type: InventoryType;
        quantity: number;
        marketingId?: string;
        note?: string;
    }[]): Promise<any[]>;
    bulkRemove(items: {
        type: InventoryType;
        quantity: number;
        note?: string;
    }[]): Promise<any[]>;
}
