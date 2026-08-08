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
                amount: import("@prisma/client/runtime/library").Decimal;
                quantity: string;
                date: Date;
                itemName: string;
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
        type: import(".prisma/client").$Enums.InventoryType;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        lastUpdated: Date;
    })[]>;
    getSummary(): Promise<{
        meat: {
            available: number;
            unit: string;
            lastUpdated: Date;
            logs: ({
                marketing: {
                    id: string;
                    amount: import("@prisma/client/runtime/library").Decimal;
                    quantity: string;
                    date: Date;
                    itemName: string;
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
                    amount: import("@prisma/client/runtime/library").Decimal;
                    quantity: string;
                    date: Date;
                    itemName: string;
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
                amount: import("@prisma/client/runtime/library").Decimal;
                quantity: string;
                date: Date;
                itemName: string;
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
        type: import(".prisma/client").$Enums.InventoryType;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        lastUpdated: Date;
    }>;
    getLogs(type?: InventoryType): Promise<({
        marketing: {
            id: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            quantity: string;
            date: Date;
            itemName: string;
            shopName: string;
        };
        inventory: {
            id: string;
            type: import(".prisma/client").$Enums.InventoryType;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            lastUpdated: Date;
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
        type: import(".prisma/client").$Enums.InventoryType;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        lastUpdated: Date;
    }>;
    remove(removeInventoryDto: RemoveInventoryDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.InventoryType;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        lastUpdated: Date;
    }>;
    set(setInventoryDto: SetInventoryDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.InventoryType;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        lastUpdated: Date;
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
