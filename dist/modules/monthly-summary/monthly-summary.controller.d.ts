import { MonthlySummaryService } from "./monthly-summary.service";
import { MonthlySummaryResponseDto, GenerateMonthlySummaryDto, UpdateMonthlySummaryDto } from "./dto";
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
            name: string;
            phone: string;
            id: string;
        };
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalMeal: number;
        monthYear: Date;
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
            name: string;
            phone: string;
            id: string;
        };
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalMeal: number;
        monthYear: Date;
    }[]>;
    update(id: string, updateDto: UpdateMonthlySummaryDto): Promise<{
        mealRate: number;
        mealBill: number;
        utilityShare: number;
        totalBill: number;
        totalPaid: number;
        previousDue: number;
        currentDue: number;
        carryToNext: number;
        user: {
            name: string;
            phone: string;
            id: string;
        };
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalMeal: number;
        monthYear: Date;
    }>;
    deleteMonthlySummary(year: number, month: number): Promise<{
        message: string;
        count: number;
    }>;
}
