import { PaymentType } from "@prisma/client";
export declare class MarketingResponseDto {
    id: string;
    userId: string;
    userName: string;
    date: Date;
    itemName: string;
    quantity?: string;
    amount: number;
    paymentType: PaymentType;
    shopName?: string;
    note?: string;
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
}
