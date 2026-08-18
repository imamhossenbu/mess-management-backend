import { PrismaService } from "../../prisma/prisma.service";
import { CreateUtilityBillDto, UpdateUtilityBillDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class UtilityBillsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(createUtilityBillDto: CreateUtilityBillDto): Promise<{
        paidByName: string;
        payer: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        id: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidBy: string | null;
    }>;
    findAll(): Promise<{
        paidByName: string;
        payer: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        id: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidBy: string | null;
    }[]>;
    findOne(id: string): Promise<{
        paidByName: string;
        payer: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        id: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidBy: string | null;
    }>;
    findByMonth(year: number, month: number): Promise<{
        paidByName: string;
        payer: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        id: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidBy: string | null;
    }[]>;
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
        bills: {
            paidByName: string;
            payer: {
                id: string;
                name: string;
                email: string;
                phone: string;
            };
            id: string;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            billType: import(".prisma/client").$Enums.BillType;
            monthYear: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            paidBy: string | null;
        }[];
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
        paidByName: string;
        payer: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        id: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        billType: import(".prisma/client").$Enums.BillType;
        monthYear: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
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
