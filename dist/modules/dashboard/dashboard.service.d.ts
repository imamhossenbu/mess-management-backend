import { PrismaService } from "../../prisma/prisma.service";
import { DashboardStatsDto, MemberDashboardDto, DailySummaryDto, MonthlySummaryDto, ActivityDto, MealRateHistoryDto, MemberBalanceDto, MessStatsDto, WeeklySummaryDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class DashboardService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    getAdminDashboard(messId: string): Promise<DashboardStatsDto>;
    getMemberDashboard(userId: string): Promise<MemberDashboardDto>;
    getDailySummary(messId: string, date?: string): Promise<DailySummaryDto>;
    getMonthlySummaryForDashboard(messId: string, year?: number, month?: number): Promise<MonthlySummaryDto>;
    getActivities(messId: string, limit?: number, offset?: number): Promise<ActivityDto>;
    getMealRateHistory(messId: string, days?: number): Promise<MealRateHistoryDto[]>;
    getMemberBalances(messId: string): Promise<MemberBalanceDto[]>;
    getMessStats(messId: string): Promise<MessStatsDto>;
    getWeeklySummary(messId: string): Promise<WeeklySummaryDto[]>;
    getRecentActivities(messId: string): Promise<ActivityDto>;
    private getMealBreakdown;
    private calculateTotalDue;
}
