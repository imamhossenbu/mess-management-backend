import { PaymentMethod } from "@prisma/client";
export declare class CreatePaymentDto {
    userId: string;
    amount: number;
    paymentDate?: string;
    paymentMethod?: PaymentMethod;
    note?: string;
}
