import { PrismaService } from "../../prisma/prisma.service";
import { InventoryType } from "@prisma/client";
import { AddInventoryDto, RemoveInventoryDto, SetInventoryDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class InventoryService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    getAllInventory(messId: string): Promise<any[]>;
    getInventory(messId: string, type: InventoryType): Promise<any>;
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
    getLogs(messId: string, type?: InventoryType): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        note: string | null;
        change: import("@prisma/client/runtime/library").Decimal;
        reason: string;
        inventoryItemId: string;
        previousQuantity: import("@prisma/client/runtime/library").Decimal;
        newQuantity: import("@prisma/client/runtime/library").Decimal;
        marketingItemId: string | null;
    }[]>;
    addInventory(messId: string, addInventoryDto: AddInventoryDto): Promise<any>;
    removeInventory(messId: string, removeInventoryDto: RemoveInventoryDto): Promise<any>;
    setInventory(messId: string, setInventoryDto: SetInventoryDto): Promise<any>;
    checkAvailability(messId: string, type: InventoryType, requiredQuantity: number): Promise<{
        available: boolean;
        availableQuantity: any;
        requiredQuantity: number;
        type: InventoryType;
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
