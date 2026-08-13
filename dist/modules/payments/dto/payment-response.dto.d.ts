import { PaymentMethod } from "@prisma/client";
export declare class PaymentResponseDto {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    paymentDate: Date;
    paymentMethod: PaymentMethod;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UserBalanceDto {
    userId: string;
    userName: string;
    totalPaid: number;
    totalBill: number;
    balance: number;
    payments: PaymentResponseDto[];
}
export declare class MonthlyPaymentSummaryDto {
    month: string;
    year: number;
    totalPayments: number;
    totalAmount: number;
    payments: PaymentResponseDto[];
}
