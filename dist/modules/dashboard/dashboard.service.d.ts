import { PrismaService } from "../../prisma/prisma.service";
import { DashboardStatsDto, MemberDashboardDto, DailySummaryDto, MonthlySummaryDto, ActivityDto, MealRateHistoryDto, MemberBalanceDto, MessStatsDto, WeeklySummaryDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class DashboardService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    getAdminDashboard(userId: string, year?: number, month?: number): Promise<DashboardStatsDto>;
    getMemberDashboard(userId: string, year?: number, month?: number): Promise<MemberDashboardDto>;
    getDailySummary(date?: string): Promise<DailySummaryDto>;
    getMonthlySummaryForDashboard(year?: number, month?: number): Promise<MonthlySummaryDto>;
    getActivities(limit?: number, offset?: number): Promise<ActivityDto>;
    getMealRateHistory(days?: number): Promise<MealRateHistoryDto[]>;
    getMemberBalances(year?: number, month?: number): Promise<MemberBalanceDto[]>;
    getMessStats(): Promise<MessStatsDto>;
    getWeeklySummary(): Promise<WeeklySummaryDto[]>;
    private getMealBreakdown;
    private calculateTotalDue;
}
