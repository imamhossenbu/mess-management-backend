import { PrismaService } from "../../prisma/prisma.service";
import { DashboardStatsDto, MemberDashboardDto, DailySummaryDto } from "./dto";
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getAdminDashboard(): Promise<DashboardStatsDto>;
    getMemberDashboard(userId: string): Promise<MemberDashboardDto>;
    getDailySummary(date?: string): Promise<DailySummaryDto>;
    getMonthlySummaryForDashboard(year?: number, month?: number): Promise<{
        month: string;
        year: number;
        totalMeals: number;
        totalMarketingCost: number;
        totalUtilityCost: number;
        totalCost: number;
        totalPayments: number;
        totalDue: number;
        mealRate: number;
        userSummaries: {
            userId: string;
            userName: string;
            totalMeal: number;
            totalBill: number;
            totalPaid: number;
            currentDue: number;
        }[];
    }>;
}
