import { PrismaService } from "../../prisma/prisma.service";
import { InventoryType } from "@prisma/client";
import { AddInventoryDto, RemoveInventoryDto, SetInventoryDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class InventoryService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    getAllInventory(messId: string): Promise<({
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
            messId: string;
            date: Date;
            note: string | null;
            inventoryId: string;
            change: number;
            reason: string;
            marketingId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        lastUpdated: Date;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    })[]>;
    getInventory(messId: string, type: InventoryType): Promise<{
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
            messId: string;
            date: Date;
            note: string | null;
            inventoryId: string;
            change: number;
            reason: string;
            marketingId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        lastUpdated: Date;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    }>;
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
                createdAt: Date;
                messId: string;
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
                createdAt: Date;
                messId: string;
                date: Date;
                note: string | null;
                inventoryId: string;
                change: number;
                reason: string;
                marketingId: string | null;
            })[];
        };
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
            createdAt: Date;
            updatedAt: Date;
            messId: string;
            lastUpdated: Date;
            quantity: number;
            type: import(".prisma/client").$Enums.InventoryType;
        };
    } & {
        id: string;
        createdAt: Date;
        messId: string;
        date: Date;
        note: string | null;
        inventoryId: string;
        change: number;
        reason: string;
        marketingId: string | null;
    })[]>;
    addInventory(messId: string, addInventoryDto: AddInventoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        lastUpdated: Date;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    }>;
    removeInventory(messId: string, removeInventoryDto: RemoveInventoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        lastUpdated: Date;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    }>;
    setInventory(messId: string, setInventoryDto: SetInventoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        lastUpdated: Date;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryType;
    }>;
    checkAvailability(messId: string, type: InventoryType, requiredQuantity: number): Promise<{
        available: boolean;
        availableQuantity: number;
        requiredQuantity: number;
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
