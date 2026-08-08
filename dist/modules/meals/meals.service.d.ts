import { PrismaService } from "../../prisma/prisma.service";
import { CreateMealDto, BulkMealEntryDto, SingleMealEntryDto, UpdateMealDto } from "./dto";
export declare class MealsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createMealDto: CreateMealDto): Promise<{
        user: {
            name: string;
            phone: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
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
                name: string;
                phone: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
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
                name: string;
                phone: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
        })[];
    }>;
    findAll(): Promise<({
        user: {
            name: string;
            phone: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            name: string;
            phone: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    }>;
    findByUser(userId: string, startDate?: Date, endDate?: Date): Promise<({
        user: {
            name: string;
            phone: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    })[]>;
    findByDate(date: Date): Promise<({
        user: {
            name: string;
            phone: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
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
                name: string;
                phone: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
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
            name: string;
            phone: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
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
