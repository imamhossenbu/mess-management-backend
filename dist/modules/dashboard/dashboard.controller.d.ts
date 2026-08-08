import { DashboardService } from "./dashboard.service";
import { DashboardStatsDto, MemberDashboardDto, DailySummaryDto } from "./dto";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getAdminDashboard(): Promise<DashboardStatsDto>;
    getMemberDashboard(req: any): Promise<MemberDashboardDto>;
    getDailySummary(date?: string): Promise<DailySummaryDto>;
    getMonthlySummary(year?: number, month?: number): Promise<{
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
