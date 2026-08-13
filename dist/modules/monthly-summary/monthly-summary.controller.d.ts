import { MonthlySummaryService } from "./monthly-summary.service";
import { MonthlySummaryResponseDto, GenerateMonthlySummaryDto, UpdateMonthlySummaryDto } from "./dto";
export declare class MonthlySummaryController {
    private readonly monthlySummaryService;
    constructor(monthlySummaryService: MonthlySummaryService);
    generate(messId: string, generateDto: GenerateMonthlySummaryDto): Promise<{
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
    findAll(messId: string): Promise<{
        mealRate: number;
        mealBill: number;
        utilityShare: number;
        totalBill: number;
        totalPaid: number;
        previousDue: number;
        currentDue: number;
        carryToNext: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        monthYear: Date;
        totalMeal: number;
    }[]>;
    getMonthlySummary(messId: string, year: number, month: number): Promise<MonthlySummaryResponseDto>;
    getUserSummaries(messId: string, userId: string, year?: number, month?: number): Promise<{
        mealRate: number;
        mealBill: number;
        utilityShare: number;
        totalBill: number;
        totalPaid: number;
        previousDue: number;
        currentDue: number;
        carryToNext: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        monthYear: Date;
        totalMeal: number;
    }[]>;
    update(messId: string, id: string, updateDto: UpdateMonthlySummaryDto): Promise<{
        mealRate: number;
        mealBill: number;
        utilityShare: number;
        totalBill: number;
        totalPaid: number;
        previousDue: number;
        currentDue: number;
        carryToNext: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        monthYear: Date;
        totalMeal: number;
    }>;
    deleteMonthlySummary(messId: string, year: number, month: number): Promise<{
        message: string;
        count: number;
    }>;
}
