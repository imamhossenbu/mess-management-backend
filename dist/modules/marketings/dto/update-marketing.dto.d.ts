import { PaymentType } from "@prisma/client";
export declare class UpdateMarketingDto {
    userId?: string;
    itemName?: string;
    quantity?: string;
    amount?: number;
    paymentType?: PaymentType;
    shopName?: string;
    note?: string;
}
