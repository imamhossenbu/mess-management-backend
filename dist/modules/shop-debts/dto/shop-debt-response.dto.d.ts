import { DebtStatus } from "@prisma/client";
export declare class ShopDebtResponseDto {
    id: string;
    shopName: string;
    date: Date;
    itemDetails?: string;
    amount: number;
    status: DebtStatus;
    paidDate?: Date;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ShopDebtSummaryDto {
    totalDue: number;
    totalPaid: number;
    totalAmount: number;
    shopWiseSummary: {
        shopName: string;
        totalDue: number;
        totalPaid: number;
        totalAmount: number;
    }[];
}
export declare class MonthlyShopDebtSummaryDto {
    month: string;
    year: number;
    totalDebt: number;
    totalPaid: number;
    currentDue: number;
    debts: ShopDebtResponseDto[];
}
