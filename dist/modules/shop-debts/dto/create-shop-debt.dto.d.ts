export declare class CreateShopDebtDto {
    shopName: string;
    date?: string;
    itemDetails?: string;
    amount: number;
    note?: string;
}
export declare class CreateBulkShopDebtDto {
    items: CreateShopDebtDto[];
}
