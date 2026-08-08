import { PaymentType } from "@prisma/client";
export declare class CreateMarketingDto {
    userId: string;
    date?: string;
    itemName: string;
    quantity?: string;
    amount: number;
    paymentType?: PaymentType;
    shopName?: string;
    inventoryType?: "MEAT" | "FISH";
    totalPieces?: number;
    usedPieces?: number;
    note?: string;
}
