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

  @ApiProperty({ required: false })
  mealsBreakfast?: number;

  @ApiProperty({ required: false })
  mealsLunch?: number;

  @ApiProperty({ required: false })
  mealsDinner?: number;

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

  @ApiProperty({ required: false })
  mealRate?: number;

  @ApiProperty({ required: false })
  recentPayments?: any[];

  @ApiProperty({ required: false })
  recentMeals?: any[];
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

export class MonthlySummaryDto {
  @ApiProperty()
  month: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  totalMeals: number;

  @ApiProperty()
  totalMarketingCost: number;

  @ApiProperty()
  totalUtilityCost: number;

  @ApiProperty()
  totalCost: number;

  @ApiProperty()
  totalPayments: number;

  @ApiProperty()
  totalDue: number;

  @ApiProperty()
  mealRate: number;

  @ApiProperty()
  totalMembers: number;

  @ApiProperty()
  userSummaries: Array<{
    userId: string;
    userName: string;
    userPhone?: string;
    userEmail?: string;
    totalMeal: number;
    mealBill: number;
    utilityShare: number;
    totalBill: number;
    totalPaid: number;
    previousDue: number;
    currentDue: number;
  }>;
}

export class ActivityDto {
  @ApiProperty()
  meals: any[];

  @ApiProperty()
  marketings: any[];

  @ApiProperty()
  payments: any[];
}

export class MealRateHistoryDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  mealRate: number;

  @ApiProperty()
  totalMeals: number;

  @ApiProperty()
  totalCost: number;
}

export class MemberBalanceDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  userEmail?: string;

  @ApiProperty()
  userPhone?: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  lastUpdated: Date;
}

export class MessStatsDto {
  @ApiProperty()
  totalMembers: number;

  @ApiProperty()
  activeMembers: number;

  @ApiProperty()
  totalMeals: number;

  @ApiProperty()
  totalPayments: number;

  @ApiProperty()
  totalMarketing: number;

  @ApiProperty()
  totalDue: number;

  @ApiProperty()
  mealRate: number;
}

export class WeeklySummaryDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  totalMeals: number;

  @ApiProperty()
  totalCost: number;

  @ApiProperty()
  mealRate: number;
}
