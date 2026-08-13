import { MarketingsService } from "./marketings.service";
import { CreateMarketingDto, UpdateMarketingDto } from "./dto";
export declare class MarketingsController {
    private readonly marketingsService;
    constructor(marketingsService: MarketingsService);
    create(req: any, createMarketingDto: CreateMarketingDto): Promise<{
        id: string;
        userId: string;
        date: Date;
        shopName: string;
        totalAmount: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        note: string;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        items: {
            id: string;
            itemName: string;
            quantity: number;
            unit: import(".prisma/client").$Enums.Unit;
            price: number;
            totalPrice: number;
            note: string;
            addedToInventory: boolean;
            inventoryItemId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    findAll(): Promise<{
        id: string;
        userId: string;
        date: Date;
        shopName: string;
        totalAmount: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        note: string;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        items: {
            id: string;
            itemName: string;
            quantity: number;
            unit: import(".prisma/client").$Enums.Unit;
            price: number;
            totalPrice: number;
            note: string;
            addedToInventory: boolean;
            inventoryItemId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }[]>;
    getDailySummary(date?: string): Promise<{
        date: string;
        totalAmount: number;
        totalCash: number;
        totalDebt: number;
        totalSelf: number;
        totalItems: number;
        items: {
            id: string;
            userId: string;
            date: Date;
            shopName: string;
            totalAmount: number;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            note: string;
            createdAt: Date;
            updatedAt: Date;
            userName: string;
            items: {
                id: string;
                itemName: string;
                quantity: number;
                unit: import(".prisma/client").$Enums.Unit;
                price: number;
                totalPrice: number;
                note: string;
                addedToInventory: boolean;
                inventoryItemId: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
        }[];
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
    findByUser(userId: string, startDate?: string, endDate?: string): Promise<{
        id: string;
        userId: string;
        date: Date;
        shopName: string;
        totalAmount: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        note: string;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        items: {
            id: string;
            itemName: string;
            quantity: number;
            unit: import(".prisma/client").$Enums.Unit;
            price: number;
            totalPrice: number;
            note: string;
            addedToInventory: boolean;
            inventoryItemId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }[]>;
    findByDate(date: string): Promise<{
        id: string;
        userId: string;
        date: Date;
        shopName: string;
        totalAmount: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        note: string;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        items: {
            id: string;
            itemName: string;
            quantity: number;
            unit: import(".prisma/client").$Enums.Unit;
            price: number;
            totalPrice: number;
            note: string;
            addedToInventory: boolean;
            inventoryItemId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        userId: string;
        date: Date;
        shopName: string;
        totalAmount: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        note: string;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        items: {
            id: string;
            itemName: string;
            quantity: number;
            unit: import(".prisma/client").$Enums.Unit;
            price: number;
            totalPrice: number;
            note: string;
            addedToInventory: boolean;
            inventoryItemId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    update(id: string, updateMarketingDto: UpdateMarketingDto): Promise<{
        id: string;
        userId: string;
        date: Date;
        shopName: string;
        totalAmount: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        note: string;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        items: {
            id: string;
            itemName: string;
            quantity: number;
            unit: import(".prisma/client").$Enums.Unit;
            price: number;
            totalPrice: number;
            note: string;
            addedToInventory: boolean;
            inventoryItemId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
