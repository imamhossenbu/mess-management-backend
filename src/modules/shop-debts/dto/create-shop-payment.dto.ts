// src/modules/shop-debts/dto/create-shop-payment.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateShopPaymentDto {
  @ApiProperty({ example: "MR Traders" })
  @IsString()
  shopName: string;

  @ApiProperty({ example: "2026-08-08", required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: "Paid via bKash", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
