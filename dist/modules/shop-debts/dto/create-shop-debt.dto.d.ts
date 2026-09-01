export declare class CreateShopDebtDto {
    shopName?: string;
    date?: string;
    itemDetails?: string;
    amount?: number;
    note?: string;
    items?: CreateShopDebtDto[];
}
export declare class CreateBulkShopDebtDto {
    shopName?: string;
    date?: string;
    note?: string;
    items: CreateShopDebtDto[];
}
