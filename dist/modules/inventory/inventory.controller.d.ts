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
                date: Date;
                itemName: string;
                quantity: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                shopName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            date: Date;
            note: string | null;
            marketingId: string | null;
            inventoryId: string;
            change: number;
            reason: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastUpdated: Date;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
    })[]>;
    getSummary(): Promise<{
        meat: {
            available: number;
            unit: string;
            lastUpdated: Date;
            logs: ({
                marketing: {
                    id: string;
                    date: Date;
                    itemName: string;
                    quantity: string;
                    amount: import("@prisma/client/runtime/library").Decimal;
                    shopName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                date: Date;
                note: string | null;
                marketingId: string | null;
                inventoryId: string;
                change: number;
                reason: string;
            })[];
        };
        fish: {
            available: number;
            unit: string;
            lastUpdated: Date;
            logs: ({
                marketing: {
                    id: string;
                    date: Date;
                    itemName: string;
                    quantity: string;
                    amount: import("@prisma/client/runtime/library").Decimal;
                    shopName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                date: Date;
                note: string | null;
                marketingId: string | null;
                inventoryId: string;
                change: number;
                reason: string;
            })[];
        };
    }>;
    getByType(type: InventoryType): Promise<{
        logs: ({
            marketing: {
                id: string;
                date: Date;
                itemName: string;
                quantity: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                shopName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            date: Date;
            note: string | null;
            marketingId: string | null;
            inventoryId: string;
            change: number;
            reason: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastUpdated: Date;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
    }>;
    getLogs(type?: InventoryType): Promise<({
        marketing: {
            id: string;
            date: Date;
            itemName: string;
            quantity: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            shopName: string;
        };
        inventory: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            lastUpdated: Date;
            type: import(".prisma/client").$Enums.InventoryType;
            quantity: number;
        };
    } & {
        id: string;
        createdAt: Date;
        date: Date;
        note: string | null;
        marketingId: string | null;
        inventoryId: string;
        change: number;
        reason: string;
    })[]>;
    checkAvailability(type: InventoryType, quantity: number): Promise<{
        available: boolean;
        availableQuantity: number;
        requiredQuantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    }>;
    add(addInventoryDto: AddInventoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastUpdated: Date;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
    }>;
    remove(removeInventoryDto: RemoveInventoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastUpdated: Date;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
    }>;
    set(setInventoryDto: SetInventoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastUpdated: Date;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
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
