import { PaymentType, Unit } from "@prisma/client";
export declare class MarketingItemDto {
    itemName: string;
    quantity?: number;
    unit?: Unit;
    price?: number;
    totalPrice: number;
    note?: string;
}
export declare class CreateMarketingDto {
    date?: string;
    shopName?: string;
    paymentType?: PaymentType;
    memberId?: string;
    items: MarketingItemDto[];
    note?: string;
    image?: any;
}
