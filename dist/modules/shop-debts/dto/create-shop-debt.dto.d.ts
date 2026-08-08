import { DebtStatus } from "@prisma/client";
export declare class CreateShopDebtDto {
    shopName: string;
    date?: string;
    itemDetails?: string;
    amount: number;
    status?: DebtStatus;
    note?: string;
}
