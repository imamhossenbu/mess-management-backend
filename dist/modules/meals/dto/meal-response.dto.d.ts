export declare class MealResponseDto {
    id: string;
    userId: string;
    userName: string;
    date: Date;
    morning: boolean;
    lunch: boolean;
    dinner: boolean;
    totalMeal: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DailyMealSummaryDto {
    date: string;
    totalMorning: number;
    totalLunch: number;
    totalDinner: number;
    totalMeals: number;
    meals: MealResponseDto[];
}
export declare class MonthlyMealSummaryDto {
    month: string;
    year: number;
    totalMeals: number;
    totalMorning: number;
    totalLunch: number;
    totalDinner: number;
    userSummaries: {
        userId: string;
        userName: string;
        totalMeals: number;
        morning: number;
        lunch: number;
        dinner: number;
    }[];
}
