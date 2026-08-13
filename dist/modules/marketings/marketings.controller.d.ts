import { MarketingsService } from "./marketings.service";
import { CreateMarketingDto, UpdateMarketingDto } from "./dto";
export declare class MarketingsController {
    private readonly marketingsService;
    constructor(marketingsService: MarketingsService);
    create(messId: string, createMarketingDto: CreateMarketingDto): Promise<{
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        memberId: string;
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
    }>;
    findAll(messId: string): Promise<({
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        memberId: string;
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
    })[]>;
    getDailySummary(messId: string, date?: string): Promise<{
        date: string;
        totalAmount: number;
        totalCash: number;
        totalDebt: number;
        totalSelf: number;
        totalItems: number;
        items: ({
            member: {
                user: {
                    id: string;
                    name: string;
                    phone: string;
                };
            } & {
                id: string;
                userId: string;
                messId: string;
                role: import(".prisma/client").$Enums.MessRole;
                joinedDate: Date;
                leftDate: Date | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            messId: string;
            createdAt: Date;
            updatedAt: Date;
            memberId: string;
            date: Date;
            itemName: string;
            quantity: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            shopName: string | null;
            note: string | null;
        })[];
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
    findByUser(messId: string, userId: string, startDate?: string, endDate?: string): Promise<({
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        memberId: string;
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
    })[]>;
    findByDate(messId: string, date: string): Promise<({
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        memberId: string;
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
    })[]>;
    findOne(messId: string, id: string): Promise<{
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        memberId: string;
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
    }>;
    update(messId: string, id: string, updateMarketingDto: UpdateMarketingDto): Promise<{
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        memberId: string;
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
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
