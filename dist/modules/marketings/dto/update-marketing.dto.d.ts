import { PaymentType, Unit } from "@prisma/client";
export declare class UpdateMarketingItemDto {
    itemName?: string;
    quantity?: number;
    unit?: Unit;
    price?: number;
    totalPrice?: number;
    note?: string;
}
export declare class UpdateMarketingDto {
    shopName?: string;
    paymentType?: PaymentType;
    note?: string;
    items?: UpdateMarketingItemDto[];
}
