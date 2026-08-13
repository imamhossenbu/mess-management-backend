import { InventoryService } from "./inventory.service";
import { AddInventoryDto, RemoveInventoryDto, SetInventoryDto } from "./dto";
import { InventoryType } from "@prisma/client";
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getAll(messId: string): Promise<({
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
            messId: string;
            createdAt: Date;
            date: Date;
            note: string | null;
            inventoryId: string;
            change: number;
            reason: string;
            marketingId: string | null;
        })[];
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        lastUpdated: Date;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    })[]>;
    getSummary(messId: string): Promise<{
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
                messId: string;
                createdAt: Date;
                date: Date;
                note: string | null;
                inventoryId: string;
                change: number;
                reason: string;
                marketingId: string | null;
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
                messId: string;
                createdAt: Date;
                date: Date;
                note: string | null;
                inventoryId: string;
                change: number;
                reason: string;
                marketingId: string | null;
            })[];
        };
    }>;
    getByType(messId: string, type: InventoryType): Promise<{
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
            messId: string;
            createdAt: Date;
            date: Date;
            note: string | null;
            inventoryId: string;
            change: number;
            reason: string;
            marketingId: string | null;
        })[];
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        lastUpdated: Date;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    }>;
    getLogs(messId: string, type?: InventoryType): Promise<({
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
            messId: string;
            createdAt: Date;
            updatedAt: Date;
            lastUpdated: Date;
            quantity: number;
            type: import(".prisma/client").$Enums.InventoryType;
        };
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        date: Date;
        note: string | null;
        inventoryId: string;
        change: number;
        reason: string;
        marketingId: string | null;
    })[]>;
    checkAvailability(messId: string, type: InventoryType, quantity: number): Promise<{
        available: boolean;
        availableQuantity: number;
        requiredQuantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    }>;
    add(messId: string, addInventoryDto: AddInventoryDto): Promise<{
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        lastUpdated: Date;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    }>;
    remove(messId: string, removeInventoryDto: RemoveInventoryDto): Promise<{
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        lastUpdated: Date;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    }>;
    set(messId: string, setInventoryDto: SetInventoryDto): Promise<{
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        lastUpdated: Date;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    }>;
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
