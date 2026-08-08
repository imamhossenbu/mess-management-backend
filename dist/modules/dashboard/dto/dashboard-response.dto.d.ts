export declare class DashboardStatsDto {
    totalMembers: number;
    activeMembers: number;
    totalMealsToday: number;
    totalMealsThisMonth: number;
    totalMarketingCostThisMonth: number;
    totalUtilityCostThisMonth: number;
    totalCostThisMonth: number;
    totalPaymentsThisMonth: number;
    totalDue: number;
    mealRate: number;
    inventory: {
        meat: number;
        fish: number;
    };
    recentActivities: {
        meals: any[];
        marketings: any[];
        payments: any[];
    };
}
export declare class MemberDashboardDto {
    userId: string;
    userName: string;
    totalMealThisMonth: number;
    mealBillThisMonth: number;
    utilityShareThisMonth: number;
    totalBillThisMonth: number;
    totalPaidThisMonth: number;
    currentBalance: number;
    recentPayments: any[];
}
export declare class DailySummaryDto {
    date: string;
    totalMeals: number;
    totalMorning: number;
    totalLunch: number;
    totalDinner: number;
    totalMarketingCost: number;
    mealRate: number;
}
