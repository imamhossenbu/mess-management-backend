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
    getInventory(type: InventoryType): Promise<{
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
    addInventory(addInventoryDto: AddInventoryDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.InventoryType;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        lastUpdated: Date;
    }>;
    removeInventory(removeInventoryDto: RemoveInventoryDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.InventoryType;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        lastUpdated: Date;
    }>;
    setInventory(setInventoryDto: SetInventoryDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.InventoryType;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        lastUpdated: Date;
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
