// src/modules/marketings/dto/update-marketing.dto.ts
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  IsUUID,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentType } from "@prisma/client";

export class UpdateMarketingDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  itemName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  quantity?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiProperty({ enum: PaymentType, required: false })
  @IsEnum(PaymentType)
  @IsOptional()
  paymentType?: PaymentType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
