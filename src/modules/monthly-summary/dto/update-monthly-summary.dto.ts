// src/modules/monthly-summary/dto/update-monthly-summary.dto.ts
import { IsNumber, IsOptional, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateMonthlySummaryDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalMeal?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  mealRate?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  mealBill?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  utilityShare?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalBill?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalPaid?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  previousDue?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  currentDue?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  carryToNext?: number;
}
