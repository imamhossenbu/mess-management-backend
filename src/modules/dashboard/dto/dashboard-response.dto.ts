// src/modules/dashboard/dto/dashboard-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class DashboardStatsDto {
  @ApiProperty()
  totalMembers: number;

  @ApiProperty()
  activeMembers: number;

  @ApiProperty()
  totalMealsToday: number;

  @ApiProperty()
  totalMealsThisMonth: number;

  @ApiProperty()
  totalMarketingCostThisMonth: number;

  @ApiProperty()
  totalUtilityCostThisMonth: number;

  @ApiProperty()
  totalCostThisMonth: number;

  @ApiProperty()
  totalPaymentsThisMonth: number;

  @ApiProperty()
  totalDue: number;

  @ApiProperty()
  mealRate: number;

  @ApiProperty()
  inventory: {
    meat: number;
    fish: number;
  };

  @ApiProperty()
  recentActivities: {
    meals: any[];
    marketings: any[];
    payments: any[];
  };
}

export class MemberDashboardDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  totalMealThisMonth: number;

  @ApiProperty()
  mealBillThisMonth: number;

  @ApiProperty()
  utilityShareThisMonth: number;

  @ApiProperty()
  totalBillThisMonth: number;

  @ApiProperty()
  totalPaidThisMonth: number;

  @ApiProperty()
  currentBalance: number;

  @ApiProperty()
  recentPayments: any[];
}

export class DailySummaryDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  totalMeals: number;

  @ApiProperty()
  totalMorning: number;

  @ApiProperty()
  totalLunch: number;

  @ApiProperty()
  totalDinner: number;

  @ApiProperty()
  totalMarketingCost: number;

  @ApiProperty()
  mealRate: number;
}
