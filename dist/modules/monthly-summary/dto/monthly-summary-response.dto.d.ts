export declare class UserMonthlySummaryDto {
    userId: string;
    userName: string;
    phone: string;
    totalMeal: number;
    mealRate: number;
    mealBill: number;
    utilityShare: number;
    totalBill: number;
    totalPaid: number;
    previousDue: number;
    currentDue: number;
    carryToNext: number;
}
export declare class MonthlySummaryResponseDto {
    month: string;
    year: number;
    totalMeals: number;
    mealRate: number;
    totalMealBill: number;
    totalUtilityBill: number;
    totalBill: number;
    totalPaid: number;
    totalDue: number;
    userSummaries: UserMonthlySummaryDto[];
}
export declare class GenerateMonthlySummaryDto {
    year: number;
    month: number;
}
