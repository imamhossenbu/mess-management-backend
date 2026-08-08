// src/modules/payments/dto/update-payment.dto.ts
import {
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsDateString,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod } from "@prisma/client";

export class UpdatePaymentDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  paymentDate?: string;

  @ApiProperty({ enum: PaymentMethod, required: false })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
