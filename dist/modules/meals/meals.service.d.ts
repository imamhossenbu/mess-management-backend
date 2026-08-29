import { PrismaService } from "../../prisma/prisma.service";
import { CreateMealDto, BulkMealEntryDto, SingleMealEntryDto, UpdateMealDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class MealsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(createMealDto: CreateMealDto): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        totalMeal: number;
        lunch: boolean;
        dinner: boolean;
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
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            totalMeal: number;
            lunch: boolean;
            dinner: boolean;
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
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            totalMeal: number;
            lunch: boolean;
            dinner: boolean;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        totalMeal: number;
        lunch: boolean;
        dinner: boolean;
    }[]>;
    findOne(id: string): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        totalMeal: number;
        lunch: boolean;
        dinner: boolean;
    }>;
    findByUser(userId: string, startDate?: Date, endDate?: Date): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        totalMeal: number;
        lunch: boolean;
        dinner: boolean;
    }[]>;
    findByDate(date: Date): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        totalMeal: number;
        lunch: boolean;
        dinner: boolean;
    }[]>;
    getDailySummary(date: Date): Promise<{
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
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            totalMeal: number;
            lunch: boolean;
            dinner: boolean;
        }[];
    }>;
    getMonthlySummary(year: number, month: number): Promise<{
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
    getMonthlyDateWiseMeals(year: number, month: number): Promise<{
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
    update(id: string, updateMealDto: UpdateMealDto): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        totalMeal: number;
        lunch: boolean;
        dinner: boolean;
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
