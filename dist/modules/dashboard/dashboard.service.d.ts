import { PrismaService } from "../../prisma/prisma.service";
import { DashboardStatsDto, MemberDashboardDto, DailySummaryDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class DashboardService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    getAdminDashboard(messId: string): Promise<DashboardStatsDto>;
    getMemberDashboard(userId: string): Promise<MemberDashboardDto>;
    getDailySummary(messId: string, date?: string): Promise<DailySummaryDto>;
    getMonthlySummaryForDashboard(messId: string, year?: number, month?: number): Promise<{
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
