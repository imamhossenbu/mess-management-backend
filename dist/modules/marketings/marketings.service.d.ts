import { PrismaService } from "../../prisma/prisma.service";
import { CreateMarketingDto, UpdateMarketingDto } from "./dto";
import { InventoryService } from "../inventory/inventory.service";
import { NotificationsService } from "../notifications/notifications.service";
export declare class MarketingsService {
    private prisma;
    private inventoryService;
    private notificationsService;
    constructor(prisma: PrismaService, inventoryService: InventoryService, notificationsService: NotificationsService);
    create(messId: string, userId: string, createMarketingDto: CreateMarketingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        note: string | null;
        userId: string;
        shopName: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(messId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        note: string | null;
        userId: string;
        shopName: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    findOne(messId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        note: string | null;
        userId: string;
        shopName: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
    }>;
    findByUser(messId: string, userId: string, startDate?: Date, endDate?: Date): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        note: string | null;
        userId: string;
        shopName: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    findByDate(messId: string, date: Date): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        note: string | null;
        userId: string;
        shopName: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    getDailySummary(messId: string, date: Date): Promise<{
        date: string;
        totalAmount: number;
        totalCash: number;
        totalDebt: number;
        totalSelf: number;
        totalItems: number;
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            note: string | null;
            userId: string;
            shopName: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
        }[];
    }>;
    getMonthlySummary(messId: string, year: number, month: number): Promise<{
        month: string;
        year: number;
        totalAmount: number;
        totalCash: number;
        totalDebt: number;
        totalSelf: number;
        totalItems: number;
        categorySummary: {
            itemName: string;
            totalAmount: number;
            count: number;
        }[];
    }>;
    update(messId: string, id: string, updateMarketingDto: UpdateMarketingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        note: string | null;
        userId: string;
        shopName: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(messId: string, id: string): Promise<{
        message: string;
    }>;
    removeByDate(messId: string, date: Date): Promise<{
        message: string;
        count: number;
    }>;
    private updateDailySummary;
}
