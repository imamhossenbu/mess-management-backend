import { DashboardService } from "./dashboard.service";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getAdminDashboard(req: any, year?: string, month?: string): Promise<import("./dto").DashboardStatsDto>;
    getMemberDashboard(req: any, year?: string, month?: string): Promise<import("./dto").MemberDashboardDto>;
    getDailySummary(date?: string): Promise<import("./dto").DailySummaryDto>;
    getMonthlySummary(year?: string, month?: string): Promise<import("./dto").MonthlySummaryDto>;
    getActivities(limit?: string, offset?: string): Promise<import("./dto").ActivityDto>;
    getMealRateHistory(days?: string): Promise<import("./dto").MealRateHistoryDto[]>;
    getMemberBalances(year?: string, month?: string): Promise<import("./dto").MemberBalanceDto[]>;
    getMessStats(): Promise<import("./dto").MessStatsDto>;
    getWeeklySummary(): Promise<import("./dto").WeeklySummaryDto[]>;
}
