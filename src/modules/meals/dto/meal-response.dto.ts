// src/modules/meals/dto/meal-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class MealResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  morning: boolean;

  @ApiProperty()
  lunch: boolean;

  @ApiProperty()
  dinner: boolean;

  @ApiProperty()
  totalMeal: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class DailyMealSummaryDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  totalMorning: number;

  @ApiProperty()
  totalLunch: number;

  @ApiProperty()
  totalDinner: number;

  @ApiProperty()
  totalMeals: number;

  @ApiProperty({ type: [MealResponseDto] })
  meals: MealResponseDto[];
}

export class MonthlyMealSummaryDto {
  @ApiProperty()
  month: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  totalMeals: number;

  @ApiProperty()
  totalMorning: number;

  @ApiProperty()
  totalLunch: number;

  @ApiProperty()
  totalDinner: number;

  @ApiProperty({ type: [Object] })
  userSummaries: {
    userId: string;
    userName: string;
    totalMeals: number;
    morning: number;
    lunch: number;
    dinner: number;
  }[];
}
