export declare enum BillType {
    CURRENT = "CURRENT",
    WIFI = "WIFI",
    RENT = "RENT",
    WATER = "WATER",
    KHALA = "KHALA"
}
export declare class CreateUtilityBillDto {
    billType: BillType;
    monthYear: string;
    amount: number;
    paidBy?: string;
    note?: string;
}
