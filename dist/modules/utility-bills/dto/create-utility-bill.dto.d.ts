import { BillType } from "@prisma/client";
export declare class CreateUtilityBillDto {
    billType: BillType;
    monthYear: string;
    amount: number;
    paidBy?: string;
    note?: string;
}
