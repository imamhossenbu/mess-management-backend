export declare class InventoryItemDto {
    name: string;
    quantity: number;
    unit?: string;
    minStockLevel: number;
    status: string;
}
export declare class InventoryCategoryDto {
    items: InventoryItemDto[];
    totalItems: number;
    lowStockItems: number;
}
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
    mealsLunch?: number;
    mealsDinner?: number;
    inventory: Record<string, InventoryCategoryDto>;
    recentActivities: {
        meals: any[];
        marketings: any[];
        payments: any[];
    };
    myStats?: MemberDashboardDto;
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
    mealRate?: number;
    recentPayments?: any[];
    recentMeals?: any[];
}
export declare class DailySummaryDto {
    date: string;
    totalMeals: number;
    totalLunch: number;
    totalDinner: number;
    totalMarketingCost: number;
    mealRate: number;
}
export declare class MonthlySummaryDto {
    month: string;
    year: number;
    totalMeals: number;
    totalMarketingCost: number;
    totalUtilityCost: number;
    totalCost: number;
    totalPayments: number;
    totalDue: number;
    mealRate: number;
    totalMembers: number;
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
export declare class ActivityDto {
    meals: any[];
    marketings: any[];
    payments: any[];
}
export declare class MealRateHistoryDto {
    date: string;
    mealRate: number;
    totalMeals: number;
    totalCost: number;
}
export declare class MemberBalanceDto {
    userId: string;
    userName: string;
    userEmail?: string;
    userPhone?: string;
    balance: number;
    lastUpdated: Date;
}
export declare class MessStatsDto {
    totalMembers: number;
    activeMembers: number;
    totalMeals: number;
    totalPayments: number;
    totalMarketing: number;
    totalDue: number;
    mealRate: number;
}
export declare class WeeklySummaryDto {
    date: string;
    totalMeals: number;
    totalCost: number;
    mealRate: number;
}
