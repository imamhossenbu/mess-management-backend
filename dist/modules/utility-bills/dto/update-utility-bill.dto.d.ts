import { BillType } from "@prisma/client";
export declare class UpdateUtilityBillDto {
    billType?: BillType;
    amount?: number;
    paidBy?: string;
    note?: string;
    monthYear?: string;
}
