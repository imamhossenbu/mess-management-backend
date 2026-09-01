import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsDateString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateShopDebtDto {
  @ApiProperty({ example: "MR Traders", required: false })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiProperty({ example: "2026-08-08", required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: "চাল, ডাল, তেল, মসলা", required: false })
  @IsString()
  @IsOptional()
  itemDetails?: string;

  @ApiProperty({ example: 5000, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiProperty({ example: "আগস্ট মাসের বাকি", required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ type: [CreateShopDebtDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShopDebtDto)
  @IsOptional()
  items?: CreateShopDebtDto[];
}

export class CreateBulkShopDebtDto {
  @ApiProperty({ example: "MR Traders", required: false })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiProperty({ example: "2026-08-08", required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: "আগস্ট মাসের বাকি", required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ type: [CreateShopDebtDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateShopDebtDto)
  items: CreateShopDebtDto[];
}

