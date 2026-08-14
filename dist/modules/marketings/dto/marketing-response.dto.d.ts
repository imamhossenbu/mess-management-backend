import { PaymentType, Unit } from "@prisma/client";
export declare class MarketingItemResponseDto {
    id: string;
    itemName: string;
    quantity: number;
    unit: Unit;
    price: number;
    totalPrice: number;
    note?: string;
    addedToInventory: boolean;
    inventoryItemId?: string;
    createdAt: Date;
}
export declare class MarketingResponseDto {
    id: string;
    userId: string;
    userName: string;
    date: Date;
    shopName?: string;
    totalAmount: number;
    paymentType: PaymentType;
    note?: string;
    imageUrl?: string;
    items: MarketingItemResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class DailyMarketingSummaryDto {
    date: string;
    totalAmount: number;
    totalCash: number;
    totalDebt: number;
    totalSelf: number;
    totalItems: number;
    items: MarketingResponseDto[];
}
export declare class MonthlyMarketingSummaryDto {
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
    marketings?: MarketingResponseDto[];
}
