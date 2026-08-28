import { MealsService } from "./meals.service";
import { CreateMealDto, BulkMealEntryDto, SingleMealEntryDto, UpdateMealDto } from "./dto";
export declare class MealsController {
    private readonly mealsService;
    constructor(mealsService: MealsService);
    create(createMealDto: CreateMealDto): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        date: Date;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    bulkEntry(bulkMealDto: BulkMealEntryDto): Promise<{
        date: string;
        totalUsers: number;
        summary: {
            totalLunch: number;
            totalDinner: number;
            totalMeals: number;
        };
        meals: {
            userName: string;
            user: {
                id: string;
                name: string;
                phone: string;
            };
            id: string;
            date: Date;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        }[];
    }>;
    singleMealEntry(singleMealDto: SingleMealEntryDto): Promise<{
        date: string;
        mealType: "lunch" | "dinner";
        totalUsers: number;
        summary: {
            totalLunch: number;
            totalDinner: number;
            totalMeals: number;
        };
        meals: {
            userName: string;
            user: {
                id: string;
                name: string;
                phone: string;
            };
            id: string;
            date: Date;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        }[];
    }>;
    findAll(): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        date: Date;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    getDailySummary(date?: string): Promise<{
        date: string;
        totalLunch: number;
        totalDinner: number;
        totalMeals: number;
        totalUsers: number;
        mealRate: number;
        runningMarketCost: number;
        runningTotalMeal: number;
        meals: {
            userName: string;
            user: {
                id: string;
                name: string;
                phone: string;
            };
            id: string;
            date: Date;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        }[];
    }>;
    getMonthlySummary(year?: number, month?: number): Promise<{
        month: string;
        year: number;
        totalLunch: number;
        totalDinner: number;
        totalMeals: number;
        totalUsers: number;
        userSummaries: {
            userId: string;
            userName: string;
            lunch: number;
            dinner: number;
            totalMeals: number;
        }[];
    }>;
    getMonthlyDateWiseMeals(year?: number, month?: number): Promise<{
        month: string;
        year: number;
        totalDays: number;
        monthlyTotals: {
            totalMorning: any;
            totalLunch: any;
            totalDinner: any;
            totalMeals: any;
        };
        userMonthlyTotals: {
            userId: string;
            userName: string;
            morning: number;
            lunch: number;
            dinner: number;
            totalMeals: number;
        }[];
        dailyData: {
            date: string;
            dayOfWeek: string;
            totalMorning: any;
            totalLunch: any;
            totalDinner: any;
            totalMeals: any;
            totalUsers: any;
            userMeals: {
                userId: string;
                userName: string;
                morning: any;
                lunch: any;
                dinner: any;
                totalMeal: any;
            }[];
        }[];
    }>;
    findByUser(userId: string, startDate?: string, endDate?: string): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        date: Date;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    findByDate(date: string): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        date: Date;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    findOne(id: string): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        date: Date;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    update(id: string, updateMealDto: UpdateMealDto): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        date: Date;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeByDate(date: string): Promise<{
        message: string;
        count: number;
    }>;
}
