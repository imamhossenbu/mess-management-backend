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
            phone: string;
            id: string;
            name: string;
        };
        userId: string;
        totalMeal: number;
        adjustmentFromPrevious: import("@prisma/client/runtime/library").Decimal;
        adjustmentToNext: import("@prisma/client/runtime/library").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        monthYear: Date;
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
            phone: string;
            id: string;
            name: string;
        };
        userId: string;
        totalMeal: number;
        adjustmentFromPrevious: import("@prisma/client/runtime/library").Decimal;
        adjustmentToNext: import("@prisma/client/runtime/library").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        monthYear: Date;
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
            phone: string;
            id: string;
            name: string;
        };
        userId: string;
        totalMeal: number;
        adjustmentFromPrevious: import("@prisma/client/runtime/library").Decimal;
        adjustmentToNext: import("@prisma/client/runtime/library").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        monthYear: Date;
    }>;
    deleteMonthlySummary(year: number, month: number): Promise<{
        message: string;
        count: number;
    }>;
}
