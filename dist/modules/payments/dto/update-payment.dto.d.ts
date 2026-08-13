import { PaymentMethod } from "@prisma/client";
export declare class UpdatePaymentDto {
    amount?: number;
    paymentDate?: string;
    paymentMethod?: PaymentMethod;
    note?: string;
}
