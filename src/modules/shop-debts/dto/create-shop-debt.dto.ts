// src/modules/shop-debts/dto/create-shop-debt.dto.ts
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

export class CreateShopDebtDto {
  @ApiProperty({ example: "MR Traders" })
  @IsString()
  shopName: string;

  @ApiProperty({ example: "2026-08-08", required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: "চাল, ডাল, তেল, মসলা", required: false })
  @IsString()
  @IsOptional()
  itemDetails?: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  amount: number;


  @ApiProperty({ example: "আগস্ট মাসের বাকি", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateBulkShopDebtDto {
  @ApiProperty({ type: [CreateShopDebtDto] })
  items: CreateShopDebtDto[];
}
