import { MealsService } from "./meals.service";
import { CreateMealDto, BulkMealEntryDto, SingleMealEntryDto, UpdateMealDto } from "./dto";
export declare class MealsController {
    private readonly mealsService;
    constructor(mealsService: MealsService);
    create(createMealDto: CreateMealDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        userId: string;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    }>;
    bulkEntry(bulkMealDto: BulkMealEntryDto): Promise<{
        date: string;
        totalUsers: number;
        summary: {
            totalMorning: number;
            totalLunch: number;
            totalDinner: number;
            totalMeals: number;
        };
        meals: ({
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            userId: string;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
        })[];
    }>;
    singleMealEntry(singleMealDto: SingleMealEntryDto): Promise<{
        date: string;
        mealType: "morning" | "lunch" | "dinner";
        totalUsers: number;
        summary: {
            totalMorning: number;
            totalLunch: number;
            totalDinner: number;
            totalMeals: number;
        };
        meals: ({
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            userId: string;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
        })[];
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        userId: string;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    })[]>;
    getDailySummary(date?: string): Promise<{
        date: string;
        totalMorning: number;
        totalLunch: number;
        totalDinner: number;
        totalMeals: number;
        totalUsers: number;
        mealRate: number;
        runningMarketCost: number;
        runningTotalMeal: number;
        meals: ({
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            userId: string;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
        })[];
    }>;
    getMonthlySummary(year?: number, month?: number): Promise<{
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
    findByUser(userId: string, startDate?: string, endDate?: string): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        userId: string;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    })[]>;
    findByDate(date: string): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        userId: string;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        userId: string;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    }>;
    update(id: string, updateMealDto: UpdateMealDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        userId: string;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeByDate(date: string): Promise<{
        message: string;
        count: number;
    }>;
}
