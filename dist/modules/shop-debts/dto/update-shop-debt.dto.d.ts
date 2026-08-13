import { DebtStatus } from "@prisma/client";
export declare class UpdateShopDebtDto {
    shopName?: string;
    itemDetails?: string;
    amount?: number;
    status?: DebtStatus;
    paidDate?: string;
    note?: string;
}
