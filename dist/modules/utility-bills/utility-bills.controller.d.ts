import { UtilityBillsService } from "./utility-bills.service";
import { CreateUtilityBillDto, UpdateUtilityBillDto } from "./dto";
export declare class UtilityBillsController {
    private readonly utilityBillsService;
    constructor(utilityBillsService: UtilityBillsService);
    create(messId: string, createUtilityBillDto: CreateUtilityBillDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: string;
        monthYear: Date;
        paidBy: string | null;
    }>;
    findAll(messId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: string;
        monthYear: Date;
        paidBy: string | null;
    }[]>;
    getSummary(messId: string): Promise<{
        totalCurrent: number;
        totalWifi: number;
        totalRent: number;
        totalWater: number;
        totalKhala: number;
        totalAmount: number;
        perPersonShare: number;
        totalMembers: any;
    }>;
    getMonthlySummary(messId: string, year?: number, month?: number): Promise<{
        month: string;
        year: number;
        totalCurrent: number;
        totalWifi: number;
        totalRent: number;
        totalWater: number;
        totalKhala: number;
        totalAmount: number;
        perPersonShare: number;
        totalMembers: any;
        bills: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            billType: string;
            monthYear: Date;
            paidBy: string | null;
        }[];
    }>;
    findByMonth(messId: string, year: number, month: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: string;
        monthYear: Date;
        paidBy: string | null;
    }[]>;
    findOne(messId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: string;
        monthYear: Date;
        paidBy: string | null;
    }>;
    update(messId: string, id: string, updateUtilityBillDto: UpdateUtilityBillDto): Promise<{
        payer: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: string;
        monthYear: Date;
        paidBy: string | null;
    }>;
    remove(messId: string, id: string): Promise<{
        message: string;
    }>;
    removeByMonth(messId: string, year: number, month: number): Promise<{
        message: string;
        count: number;
    }>;
}
