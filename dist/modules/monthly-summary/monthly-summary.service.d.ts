import { PrismaService } from "../../prisma/prisma.service";
import { UserMonthlySummaryDto, MonthlySummaryResponseDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class MonthlySummaryService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    generateMonthlySummary(year: number, month: number): Promise<{
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
    }>;
    private saveMonthlySummary;
    private sendNotifications;
    getMonthlySummary(year: number, month: number): Promise<MonthlySummaryResponseDto>;
    getUserMonthlySummaries(userId: string, year?: number, month?: number): Promise<{
        mealRate: number;
        mealBill: number;
        utilityShare: number;
        totalBill: number;
        totalPaid: number;
        previousDue: number;
        currentDue: number;
        carryToNext: number;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        monthYear: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalMeal: number;
    }[]>;
    getAllMonthlySummaries(): Promise<{
        mealRate: number;
        mealBill: number;
        utilityShare: number;
        totalBill: number;
        totalPaid: number;
        previousDue: number;
        currentDue: number;
        carryToNext: number;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        monthYear: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalMeal: number;
    }[]>;
    updateMonthlySummary(id: string, updateDto: any): Promise<{
        mealRate: number;
        mealBill: number;
        utilityShare: number;
        totalBill: number;
        totalPaid: number;
        previousDue: number;
        currentDue: number;
        carryToNext: number;
        user: {
            id: string;
            name: string;
            phone: string;
        };
        monthYear: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalMeal: number;
    }>;
    deleteMonthlySummary(year: number, month: number): Promise<{
        message: string;
        count: number;
    }>;
}
