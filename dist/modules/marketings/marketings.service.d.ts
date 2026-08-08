import { PrismaService } from "../../prisma/prisma.service";
import { CreateMarketingDto, UpdateMarketingDto } from "./dto";
import { InventoryService } from "../inventory/inventory.service";
export declare class MarketingsService {
    private prisma;
    private inventoryService;
    constructor(prisma: PrismaService, inventoryService: InventoryService);
    create(createMarketingDto: CreateMarketingDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        quantity: string | null;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        note: string | null;
        userId: string;
        itemName: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        quantity: string | null;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        note: string | null;
        userId: string;
        itemName: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        quantity: string | null;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        note: string | null;
        userId: string;
        itemName: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
    }>;
    findByUser(userId: string, startDate?: Date, endDate?: Date): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        quantity: string | null;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        note: string | null;
        userId: string;
        itemName: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
    })[]>;
    findByDate(date: Date): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        quantity: string | null;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        note: string | null;
        userId: string;
        itemName: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
    })[]>;
    getDailySummary(date: Date): Promise<{
        date: string;
        totalAmount: number;
        totalCash: number;
        totalDebt: number;
        totalSelf: number;
        totalItems: number;
        items: ({
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            quantity: string | null;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            note: string | null;
            userId: string;
            itemName: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            shopName: string | null;
        })[];
    }>;
    getMonthlySummary(year: number, month: number): Promise<{
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
    update(id: string, updateMarketingDto: UpdateMarketingDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        quantity: string | null;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        note: string | null;
        userId: string;
        itemName: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeByDate(date: Date): Promise<{
        message: string;
        count: number;
    }>;
    private updateDailySummary;
}
