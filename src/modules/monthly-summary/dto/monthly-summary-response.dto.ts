// src/modules/monthly-summary/dto/monthly-summary-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsNumber } from "class-validator";


export class UserMonthlySummaryDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  totalMeal: number;

  @ApiProperty()
  mealRate: number;

  @ApiProperty()
  mealBill: number;

  @ApiProperty()
  utilityShare: number;

  @ApiProperty()
  totalBill: number;

  @ApiProperty()
  totalPaid: number;

  @ApiProperty()
  previousDue: number;

  @ApiProperty()
  currentDue: number; // + = পাওনা, - = বাকি

  @ApiProperty()
  carryToNext: number;
}

export class MonthlySummaryResponseDto {
  @ApiProperty({ description: "Whether this month's calculation sheet has been generated" })
  isGenerated: boolean;

  @ApiProperty()
  month: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  totalMeals: number;

  @ApiProperty()
  mealRate: number;

  @ApiProperty()
  totalMealBill: number;

  @ApiProperty()
  totalUtilityBill: number;

  @ApiProperty()
  totalBill: number;

  @ApiProperty()
  totalPaid: number;

  @ApiProperty()
  totalDue: number;

  @ApiProperty()
  adjustmentFromPrevious: number;

  @ApiProperty()
  adjustmentToNext: number;

  @ApiProperty({ type: [UserMonthlySummaryDto] })
  userSummaries: UserMonthlySummaryDto[];
}

export class GenerateMonthlySummaryDto {
  @ApiProperty({ example: 2026 })
  @IsInt()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 8 })
  @IsInt()
  @IsNotEmpty()
  month: number;

  @ApiProperty({ example: 500, required: false })
  @IsOptional()
  @IsNumber()
  adjustmentFromPrevious?: number;

  @ApiProperty({ example: 1000, required: false })
  @IsOptional()
  @IsNumber()
  adjustmentToNext?: number;
}


