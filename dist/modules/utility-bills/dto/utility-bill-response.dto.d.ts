import { BillType } from "@prisma/client";
export declare class UtilityBillResponseDto {
    id: string;
    billType: BillType;
    monthYear: Date;
    amount: number;
    paidBy?: string;
    paidByName?: string;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class MonthlyUtilitySummaryDto {
    month: string;
    year: number;
    totalCurrent: number;
    totalWifi: number;
    totalRent: number;
    totalWater: number;
    totalKhala: number;
    totalAmount: number;
    perPersonShare: number;
    totalMembers: number;
    bills: UtilityBillResponseDto[];
}
export declare class UtilityBillSummaryDto {
    totalCurrent: number;
    totalWifi: number;
    totalRent: number;
    totalWater: number;
    totalKhala: number;
    totalAmount: number;
    perPersonShare: number;
    totalMembers: number;
}
