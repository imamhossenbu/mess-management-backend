import { MonthlySummaryService } from "./monthly-summary.service";
import { MonthlySummaryResponseDto, GenerateMonthlySummaryDto } from "./dto";
export declare class MonthlySummaryController {
    private readonly monthlySummaryService;
    constructor(monthlySummaryService: MonthlySummaryService);
    generate(generateDto: GenerateMonthlySummaryDto): Promise<{
        month: string;
        year: number;
        totalMeals: number;
        mealRate: number;
        totalMealBill: number;
        totalUtilityBill: number;
        totalBill: number;
        totalPaid: number;
        totalDue: number;
        userSummaries: import("./dto").UserMonthlySummaryDto[];
    }>;
    findAll(): Promise<{
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
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        monthYear: Date;
        totalMeal: number;
    }[]>;
    getMonthlySummary(year: number, month: number): Promise<MonthlySummaryResponseDto>;
    getUserSummaries(userId: string, year?: number, month?: number): Promise<{
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
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        monthYear: Date;
        totalMeal: number;
    }[]>;
    deleteMonthlySummary(year: number, month: number): Promise<{
        message: string;
        count: number;
    }>;
}
