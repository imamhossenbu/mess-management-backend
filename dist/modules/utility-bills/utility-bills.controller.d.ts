import { UtilityBillsService } from "./utility-bills.service";
import { CreateUtilityBillDto, UpdateUtilityBillDto } from "./dto";
export declare class UtilityBillsController {
    private readonly utilityBillsService;
    constructor(utilityBillsService: UtilityBillsService);
    create(createUtilityBillDto: CreateUtilityBillDto): Promise<{
        paidByName: string;
        payer: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: import(".prisma/client").$Enums.BillType;
        paidBy: string | null;
        monthYear: Date;
    }>;
    findAll(): Promise<{
        paidByName: string;
        payer: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: import(".prisma/client").$Enums.BillType;
        paidBy: string | null;
        monthYear: Date;
    }[]>;
    getSummary(): Promise<{
        totalCurrent: number;
        totalWifi: number;
        totalRent: number;
        totalWater: number;
        totalKhala: number;
        totalAmount: number;
        perPersonShare: number;
        totalMembers: number;
    }>;
    getMonthlySummary(year?: number, month?: number): Promise<{
        month: string;
        year: number;
        totalCurrent: number;
        totalWifi: number;
        totalRent: number;
        totalWater: number;
        totalKhala: number;
        totalAmount: number;
        perPersonShare: number;
        totalMembers: number;
        bills: {
            paidByName: string;
            payer: {
                email: string;
                id: string;
                name: string;
                phone: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            billType: import(".prisma/client").$Enums.BillType;
            paidBy: string | null;
            monthYear: Date;
        }[];
    }>;
    findByMonth(year: number, month: number): Promise<{
        paidByName: string;
        payer: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: import(".prisma/client").$Enums.BillType;
        paidBy: string | null;
        monthYear: Date;
    }[]>;
    findOne(id: string): Promise<{
        paidByName: string;
        payer: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: import(".prisma/client").$Enums.BillType;
        paidBy: string | null;
        monthYear: Date;
    }>;
    update(id: string, updateUtilityBillDto: UpdateUtilityBillDto): Promise<{
        paidByName: string;
        payer: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: import(".prisma/client").$Enums.BillType;
        paidBy: string | null;
        monthYear: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeByMonth(year: number, month: number): Promise<{
        message: string;
        count: number;
    }>;
}
