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
                amount: import("@prisma/client/runtime/library").Decimal;
                quantity: string;
                date: Date;
                itemName: string;
                shopName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            messId: string;
            date: Date;
            note: string | null;
            marketingId: string | null;
            inventoryId: string;
            change: number;
            reason: string;
        })[];
    } & {
        type: import(".prisma/client").$Enums.InventoryType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        lastUpdated: Date;
        quantity: number;
    })[]>;
    getSummary(messId: string): Promise<{
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
                messId: string;
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
                messId: string;
                date: Date;
                note: string | null;
                marketingId: string | null;
                inventoryId: string;
                change: number;
                reason: string;
            })[];
        };
    }>;
    getByType(messId: string, type: InventoryType): Promise<{
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
            messId: string;
            date: Date;
            note: string | null;
            marketingId: string | null;
            inventoryId: string;
            change: number;
            reason: string;
        })[];
    } & {
        type: import(".prisma/client").$Enums.InventoryType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        lastUpdated: Date;
        quantity: number;
    }>;
    getLogs(messId: string, type?: InventoryType): Promise<({
        marketing: {
            id: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            quantity: string;
            date: Date;
            itemName: string;
            shopName: string;
        };
        inventory: {
            type: import(".prisma/client").$Enums.InventoryType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            messId: string;
            lastUpdated: Date;
            quantity: number;
        };
    } & {
        id: string;
        createdAt: Date;
        messId: string;
        date: Date;
        note: string | null;
        marketingId: string | null;
        inventoryId: string;
        change: number;
        reason: string;
    })[]>;
    checkAvailability(messId: string, type: InventoryType, quantity: number): Promise<{
        available: boolean;
        availableQuantity: number;
        requiredQuantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    }>;
    add(messId: string, addInventoryDto: AddInventoryDto): Promise<{
        type: import(".prisma/client").$Enums.InventoryType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        lastUpdated: Date;
        quantity: number;
    }>;
    remove(messId: string, removeInventoryDto: RemoveInventoryDto): Promise<{
        type: import(".prisma/client").$Enums.InventoryType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        lastUpdated: Date;
        quantity: number;
    }>;
    set(messId: string, setInventoryDto: SetInventoryDto): Promise<{
        type: import(".prisma/client").$Enums.InventoryType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        lastUpdated: Date;
        quantity: number;
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
