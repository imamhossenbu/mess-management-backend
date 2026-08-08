// src/modules/payments/dto/create-payment.dto.ts
import {
  IsUUID,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsDateString,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod } from "@prisma/client";

export class CreatePaymentDto {
  @ApiProperty({ example: "user-id-123" })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: "2026-08-08", required: false })
  @IsDateString()
  @IsOptional()
  paymentDate?: string;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({ example: "আগস্ট মাসের জমা", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
