// src/modules/utility-bills/dto/update-utility-bill.dto.ts
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
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
  @IsUUID()
  @IsOptional()
  paidBy?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
