import { DashboardService } from "./dashboard.service";
import { DashboardStatsDto, MemberDashboardDto, DailySummaryDto } from "./dto";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getAdminDashboard(messId: string): Promise<DashboardStatsDto>;
    getMemberDashboard(req: any): Promise<MemberDashboardDto>;
    getDailySummary(messId: string, date?: string): Promise<DailySummaryDto>;
    getMonthlySummary(messId: string, year?: string, month?: string): Promise<import("./dto").MonthlySummaryDto>;
}
