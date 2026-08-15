// src/modules/marketings/dto/update-marketing.dto.ts
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  IsArray,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentType, Unit } from "@prisma/client";
import { Transform, Type, plainToInstance } from "class-transformer";

export class UpdateMarketingItemDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  itemName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  quantity?: number;

  @ApiProperty({ enum: Unit, required: false })
  @IsEnum(Unit)
  @IsOptional()
  unit?: Unit;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalPrice?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateMarketingDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiProperty({ enum: PaymentType, required: false })
  @IsEnum(PaymentType)
  @IsOptional()
  paymentType?: PaymentType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ type: [UpdateMarketingItemDto], required: false })
  @Transform(({ value }) => {
    let parsed = value;
    if (typeof value === "string") {
      try {
        parsed = JSON.parse(value);
      } catch {
        return value;
      }
    }
    if (!Array.isArray(parsed)) return parsed;
    return plainToInstance(UpdateMarketingItemDto, parsed);
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMarketingItemDto)
  @IsOptional()
  items?: UpdateMarketingItemDto[];

  @ApiProperty({
    required: false,
    description: "Set to true to remove the existing image",
  })
  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  removeImage?: boolean;
}
