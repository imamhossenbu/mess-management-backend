import { MarketingsService } from "./marketings.service";
import { CreateMarketingDto, UpdateMarketingDto } from "./dto";
export declare class MarketingsController {
    private readonly marketingsService;
    constructor(marketingsService: MarketingsService);
    create(messId: string, req: any, createMarketingDto: CreateMarketingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        shopName: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
    }>;
    findAll(messId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        shopName: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
    }[]>;
    getDailySummary(messId: string, date?: string): Promise<{
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
            userId: string;
            date: Date;
            shopName: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
        }[];
    }>;
    getMonthlySummary(messId: string, year?: number, month?: number): Promise<{
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
    findByUser(messId: string, userId: string, startDate?: string, endDate?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        shopName: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
    }[]>;
    findByDate(messId: string, date: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        shopName: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
    }[]>;
    findOne(messId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        shopName: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
    }>;
    update(messId: string, id: string, updateMarketingDto: UpdateMarketingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        shopName: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
    }>;
    remove(messId: string, id: string): Promise<{
        message: string;
    }>;
    removeByDate(messId: string, date: string): Promise<{
        message: string;
        count: number;
    }>;
}
