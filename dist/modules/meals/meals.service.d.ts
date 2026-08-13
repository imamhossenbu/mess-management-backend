import { PrismaService } from "../../prisma/prisma.service";
import { CreateMealDto, BulkMealEntryDto, SingleMealEntryDto, UpdateMealDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class MealsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(messId: string, createMealDto: CreateMealDto): Promise<{
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
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
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                messId: string;
                role: import(".prisma/client").$Enums.MessRole;
                roles: import(".prisma/client").$Enums.MessRole[];
                joinedDate: Date;
                leftDate: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            messId: string;
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
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                messId: string;
                role: import(".prisma/client").$Enums.MessRole;
                roles: import(".prisma/client").$Enums.MessRole[];
                joinedDate: Date;
                leftDate: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            messId: string;
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
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
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
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        memberId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    }>;
    findByUser(messId: string, userId: string, startDate?: Date, endDate?: Date): Promise<({
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        memberId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    })[]>;
    findByDate(messId: string, date: Date): Promise<({
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        memberId: string;
        date: Date;
        morning: boolean;
        lunch: boolean;
        dinner: boolean;
        totalMeal: number;
    })[]>;
    getDailySummary(messId: string, date: Date): Promise<{
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
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                messId: string;
                role: import(".prisma/client").$Enums.MessRole;
                roles: import(".prisma/client").$Enums.MessRole[];
                joinedDate: Date;
                leftDate: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            messId: string;
            memberId: string;
            date: Date;
            morning: boolean;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
        })[];
    }>;
    getMonthlySummary(messId: string, year: number, month: number): Promise<{
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
    update(messId: string, id: string, updateMealDto: UpdateMealDto): Promise<{
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
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
    removeByDate(messId: string, date: Date): Promise<{
        message: string;
        count: number;
    }>;
    private updateDailySummary;
}
