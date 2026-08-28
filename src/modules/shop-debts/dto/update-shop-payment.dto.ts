// src/modules/shop-debts/dto/update-shop-payment.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateShopPaymentDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
