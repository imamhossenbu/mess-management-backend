import { MarketingsService } from "./marketings.service";
import { CreateMarketingDto, UpdateMarketingDto } from "./dto";
export declare class MarketingsController {
    private readonly marketingsService;
    constructor(marketingsService: MarketingsService);
    create(createMarketingDto: CreateMarketingDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    getDailySummary(date?: string): Promise<{
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
            date: Date;
            itemName: string;
            quantity: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            shopName: string | null;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        })[];
    }>;
    getMonthlySummary(year?: number, month?: number): Promise<{
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
    findByUser(userId: string, startDate?: string, endDate?: string): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findByDate(date: string): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    update(id: string, updateMarketingDto: UpdateMarketingDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeByDate(date: string): Promise<{
        message: string;
        count: number;
    }>;
}
