// src/modules/payments/dto/create-payment.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod } from "@prisma/client";

export class CreatePaymentDto {
  @ApiProperty({ example: "cmszp8z02000fyw4s3hct0jyr" })
  @IsString() // ✅ @IsUUID() এর পরিবর্তে @IsString()
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
