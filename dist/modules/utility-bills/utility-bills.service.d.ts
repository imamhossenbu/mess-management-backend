import { PrismaService } from "../../prisma/prisma.service";
import { CreateUtilityBillDto, UpdateUtilityBillDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class UtilityBillsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(createUtilityBillDto: CreateUtilityBillDto): Promise<{
        payer: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidBy: string | null;
    }>;
    findAll(): Promise<({
        payer: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidBy: string | null;
    })[]>;
    findOne(id: string): Promise<{
        payer: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidBy: string | null;
    }>;
    findByMonth(year: number, month: number): Promise<({
        payer: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidBy: string | null;
    })[]>;
    getMonthlySummary(year: number, month: number): Promise<{
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
        bills: ({
            payer: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            billType: import(".prisma/client").$Enums.BillType;
            monthYear: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            paidBy: string | null;
        })[];
    }>;
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
    update(id: string, updateUtilityBillDto: UpdateUtilityBillDto): Promise<{
        payer: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidBy: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeByMonth(year: number, month: number): Promise<{
        message: string;
        count: number;
    }>;
}
