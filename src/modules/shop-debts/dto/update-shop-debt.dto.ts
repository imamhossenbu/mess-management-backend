// src/modules/shop-debts/dto/update-shop-debt.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { DebtStatus } from "@prisma/client";

export class UpdateShopDebtDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  itemDetails?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiProperty({ enum: DebtStatus, required: false })
  @IsEnum(DebtStatus)
  @IsOptional()
  status?: DebtStatus;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  paidDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
