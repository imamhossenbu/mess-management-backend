import { PrismaService } from "../../prisma/prisma.service";
import { CreateMealDto, BulkMealEntryDto, SingleMealEntryDto, UpdateMealDto } from "./dto";
export declare class MealsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createMealDto: CreateMealDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        date: Date;
        morning: boolean;
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
            date: Date;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
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
            date: Date;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
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
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findByUser(userId: string, startDate?: Date, endDate?: Date): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findByDate(date: Date): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    getDailySummary(date: Date): Promise<{
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
            date: Date;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        })[];
    }>;
    getMonthlySummary(year: number, month: number): Promise<{
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
    update(id: string, updateMealDto: UpdateMealDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        date: Date;
        morning: boolean;
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
    removeByDate(date: Date): Promise<{
        message: string;
        count: number;
    }>;
    private updateDailySummary;
}
