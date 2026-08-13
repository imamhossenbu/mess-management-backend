import { MealsService } from "./meals.service";
import { CreateMealDto, BulkMealEntryDto, SingleMealEntryDto, UpdateMealDto } from "./dto";
export declare class MealsController {
    private readonly mealsService;
    constructor(mealsService: MealsService);
    create(messId: string, createMealDto: CreateMealDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        totalMeal: number;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
    }>;
    bulkEntry(messId: string, bulkMealDto: BulkMealEntryDto): Promise<{
        date: string;
        totalUsers: number;
        summary: {
            totalMorning: number;
            totalLunch: number;
            totalDinner: number;
            totalMeals: number;
        };
        meals: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            totalMeal: number;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
        }[];
    }>;
    singleMealEntry(messId: string, singleMealDto: SingleMealEntryDto): Promise<{
        date: string;
        mealType: "morning" | "lunch" | "dinner";
        totalUsers: number;
        summary: {
            totalMorning: number;
            totalLunch: number;
            totalDinner: number;
            totalMeals: number;
        };
        meals: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            totalMeal: number;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
        }[];
    }>;
    findAll(messId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        totalMeal: number;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
    }[]>;
    getDailySummary(messId: string, date?: string): Promise<{
        date: string;
        totalMorning: number;
        totalLunch: number;
        totalDinner: number;
        totalMeals: number;
        totalUsers: number;
        mealRate: number;
        runningMarketCost: number;
        runningTotalMeal: number;
        meals: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            totalMeal: number;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
        }[];
    }>;
    getMonthlySummary(messId: string, year?: number, month?: number): Promise<{
        month: string;
        year: number;
        totalMorning: number;
        totalLunch: number;
        totalDinner: number;
        totalMeals: number;
        totalUsers: number;
        userSummaries: {
            userId: string;
            userName: string;
            morning: number;
            lunch: number;
            dinner: number;
            totalMeals: number;
        }[];
    }>;
    findByUser(messId: string, userId: string, startDate?: string, endDate?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        totalMeal: number;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
    }[]>;
    findByDate(messId: string, date: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        totalMeal: number;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
    }[]>;
    findOne(messId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        totalMeal: number;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
    }>;
    update(messId: string, id: string, updateMealDto: UpdateMealDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        totalMeal: number;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
    }>;
    remove(messId: string, id: string): Promise<{
        message: string;
    }>;
    removeByDate(messId: string, date: string): Promise<{
        message: string;
        count: number;
    }>;
}
