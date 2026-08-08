import { PrismaService } from "../../prisma/prisma.service";
import { InventoryType } from "@prisma/client";
import { AddInventoryDto, RemoveInventoryDto, SetInventoryDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class InventoryService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    getAllInventory(): Promise<({
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
    getInventory(type: InventoryType): Promise<{
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
    addInventory(addInventoryDto: AddInventoryDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeInventory(removeInventoryDto: RemoveInventoryDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setInventory(setInventoryDto: SetInventoryDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.InventoryType;
        quantity: number;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
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
