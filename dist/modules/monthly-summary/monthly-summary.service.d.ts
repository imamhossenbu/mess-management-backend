import { PrismaService } from "../../prisma/prisma.service";
import { UserMonthlySummaryDto, MonthlySummaryResponseDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class MonthlySummaryService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    generateMonthlySummary(messId: string, year: number, month: number): Promise<{
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
    getMonthlySummary(messId: string, year: number, month: number): Promise<MonthlySummaryResponseDto>;
    getUserMonthlySummaries(messId: string, userId: string, year?: number, month?: number): Promise<{
        mealRate: number;
        mealBill: number;
        utilityShare: number;
        totalBill: number;
        totalPaid: number;
        previousDue: number;
        currentDue: number;
        carryToNext: number;
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        memberId: string;
        totalMeal: number;
        monthYear: Date;
    }[]>;
    getAllMonthlySummaries(messId: string): Promise<{
        mealRate: number;
        mealBill: number;
        utilityShare: number;
        totalBill: number;
        totalPaid: number;
        previousDue: number;
        currentDue: number;
        carryToNext: number;
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        memberId: string;
        totalMeal: number;
        monthYear: Date;
    }[]>;
    updateMonthlySummary(messId: string, id: string, updateDto: any): Promise<{
        mealRate: number;
        mealBill: number;
        utilityShare: number;
        totalBill: number;
        totalPaid: number;
        previousDue: number;
        currentDue: number;
        carryToNext: number;
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        memberId: string;
        totalMeal: number;
        monthYear: Date;
    }>;
    deleteMonthlySummary(messId: string, year: number, month: number): Promise<{
        message: string;
        count: number;
    }>;
}
