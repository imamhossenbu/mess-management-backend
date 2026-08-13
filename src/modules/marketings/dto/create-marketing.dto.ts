// src/modules/marketings/dto/create-marketing.dto.ts
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
  IsArray,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentType, Unit } from "@prisma/client";
import { Type } from "class-transformer";

export class MarketingItemDto {
  @ApiProperty({ example: "Rui Fish" })
  @IsString()
  itemName: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ enum: Unit, example: "KG" })
  @IsEnum(Unit)
  unit: Unit;

  @ApiProperty({ example: 350 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 700 })
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;

  // Inventory related
  @ApiProperty({
    required: false,
    description: "Add this item to inventory",
  })
  @IsOptional()
  addToInventory?: boolean;
}

export class CreateMarketingDto {
  @ApiProperty({ example: "2026-08-08", required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: "Kacha Bazar", required: false })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiProperty({ enum: PaymentType, default: PaymentType.CASH })
  @IsEnum(PaymentType)
  @IsOptional()
  paymentType?: PaymentType;

  @ApiProperty({ type: [MarketingItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketingItemDto)
  items: MarketingItemDto[];

  @ApiProperty({ example: "Daily bazar purchase", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
