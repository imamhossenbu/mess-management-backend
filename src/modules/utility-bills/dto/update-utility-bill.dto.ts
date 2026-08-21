// src/modules/utility-bills/dto/update-utility-bill.dto.ts
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BillType } from "@prisma/client";

export class UpdateUtilityBillDto {
  @ApiProperty({ enum: BillType, required: false })
  @IsEnum(BillType)
  @IsOptional()
  billType?: BillType;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  paidBy?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ required: false, description: "বিলের মাস" })
  @IsDateString()
  @IsOptional()
  monthYear?: string; 
}
