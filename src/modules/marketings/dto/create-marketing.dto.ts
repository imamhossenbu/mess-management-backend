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
import { Transform, Type, plainToInstance } from "class-transformer";

export class MarketingItemDto {
  @ApiProperty({ example: "Rui Fish" })
  @IsString()
  itemName: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  quantity?: number;

  @ApiProperty({ enum: Unit, example: "KG", required: false })
  @IsEnum(Unit)
  @IsOptional()
  unit?: Unit;

  @ApiProperty({ example: 350, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 350 })
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;
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
  @Transform(({ value }) => {
    let parsed = value;
    if (typeof value === "string") {
      try {
        parsed = JSON.parse(value);
      } catch {
        return value; // let @IsArray produce a clean validation error
      }
    }
    if (!Array.isArray(parsed)) return parsed;
    // Manually build real class instances so class-validator's
    // whitelist/forbidNonWhitelisted can see the decorator metadata.
    return plainToInstance(MarketingItemDto, parsed);
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketingItemDto)
  items: MarketingItemDto[];

  @ApiProperty({ example: "Daily bazar purchase", required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ type: "string", format: "binary", required: false })
  @IsOptional()
  image?: any;
}
