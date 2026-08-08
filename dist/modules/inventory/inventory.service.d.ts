import { PrismaService } from "../../prisma/prisma.service";
import { InventoryType } from "@prisma/client";
import { AddInventoryDto, RemoveInventoryDto, SetInventoryDto } from "./dto";
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllInventory(): Promise<({
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
    getInventory(type: InventoryType): Promise<{
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
    addInventory(addInventoryDto: AddInventoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastUpdated: Date;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
    }>;
    removeInventory(removeInventoryDto: RemoveInventoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastUpdated: Date;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
    }>;
    setInventory(setInventoryDto: SetInventoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastUpdated: Date;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
    }>;
    checkAvailability(type: InventoryType, requiredQuantity: number): Promise<{
        available: boolean;
        availableQuantity: number;
        requiredQuantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
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
