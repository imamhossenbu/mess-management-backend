// src/modules/payments/dto/payment-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod } from "@prisma/client";

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  paymentMethod: PaymentMethod;

  @ApiProperty()
  note?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UserBalanceDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  totalPaid: number;

  @ApiProperty()
  totalBill: number;

  @ApiProperty()
  balance: number; // + = পাওনা, - = বাকি

  @ApiProperty({ type: [PaymentResponseDto] })
  payments: PaymentResponseDto[];
}

export class MonthlyPaymentSummaryDto {
  @ApiProperty()
  month: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  totalPayments: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ type: [PaymentResponseDto] })
  payments: PaymentResponseDto[];
}
