import { PrismaService } from "../../prisma/prisma.service";
import { CreateUtilityBillDto, UpdateUtilityBillDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class UtilityBillsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(messId: string, createUtilityBillDto: CreateUtilityBillDto): Promise<{
        payer: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        paidBy: string | null;
    }>;
    findAll(messId: string): Promise<({
        payer: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        paidBy: string | null;
    })[]>;
    findOne(messId: string, id: string): Promise<{
        payer: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        paidBy: string | null;
    }>;
    findByMonth(messId: string, year: number, month: number): Promise<({
        payer: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        paidBy: string | null;
    })[]>;
    getMonthlySummary(messId: string, year: number, month: number): Promise<{
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
            createdAt: Date;
            updatedAt: Date;
            messId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            billType: import(".prisma/client").$Enums.BillType;
            monthYear: Date;
            paidBy: string | null;
        })[];
    }>;
    getSummary(messId: string): Promise<{
        totalCurrent: number;
        totalWifi: number;
        totalRent: number;
        totalWater: number;
        totalKhala: number;
        totalAmount: number;
        perPersonShare: number;
        totalMembers: number;
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
        messId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        billType: import(".prisma/client").$Enums.BillType;
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
