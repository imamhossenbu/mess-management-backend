import { MealsService } from "./meals.service";
import { CreateMealDto, BulkMealEntryDto, SingleMealEntryDto, UpdateMealDto } from "./dto";
export declare class MealsController {
    private readonly mealsService;
    constructor(mealsService: MealsService);
    create(messId: string, createMealDto: CreateMealDto): Promise<{
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        memberId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
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
        meals: ({
            member: {
                user: {
                    id: string;
                    name: string;
                    phone: string;
                };
            } & {
                id: string;
                userId: string;
                messId: string;
                role: import(".prisma/client").$Enums.MessRole;
                joinedDate: Date;
                leftDate: Date | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            messId: string;
            createdAt: Date;
            updatedAt: Date;
            memberId: string;
            date: Date;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
        })[];
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
        meals: ({
            member: {
                user: {
                    id: string;
                    name: string;
                    phone: string;
                };
            } & {
                id: string;
                userId: string;
                messId: string;
                role: import(".prisma/client").$Enums.MessRole;
                joinedDate: Date;
                leftDate: Date | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            messId: string;
            createdAt: Date;
            updatedAt: Date;
            memberId: string;
            date: Date;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
        })[];
    }>;
    findAll(messId: string): Promise<({
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        memberId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    })[]>;
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
        meals: ({
            member: {
                user: {
                    id: string;
                    name: string;
                    phone: string;
                };
            } & {
                id: string;
                userId: string;
                messId: string;
                role: import(".prisma/client").$Enums.MessRole;
                joinedDate: Date;
                leftDate: Date | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            messId: string;
            createdAt: Date;
            updatedAt: Date;
            memberId: string;
            date: Date;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
        })[];
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
    findByUser(messId: string, userId: string, startDate?: string, endDate?: string): Promise<({
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        memberId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    })[]>;
    findByDate(messId: string, date: string): Promise<({
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        memberId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    })[]>;
    findOne(messId: string, id: string): Promise<{
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        memberId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    }>;
    update(messId: string, id: string, updateMealDto: UpdateMealDto): Promise<{
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        messId: string;
        createdAt: Date;
        updatedAt: Date;
        memberId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    }>;
    remove(messId: string, id: string): Promise<{
        message: string;
    }>;
    removeByDate(messId: string, date: string): Promise<{
        message: string;
        count: number;
    }>;
}
