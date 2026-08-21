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
            email: string;
            name: string;
            phone: string;
        };
        billType: import(".prisma/client").$Enums.BillType;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidBy: string | null;
        note: string | null;
        monthYear: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        paidByName: string;
        payer: {
            id: string;
            email: string;
            name: string;
            phone: string;
        };
        billType: import(".prisma/client").$Enums.BillType;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidBy: string | null;
        note: string | null;
        monthYear: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        paidByName: string;
        payer: {
            id: string;
            email: string;
            name: string;
            phone: string;
        };
        billType: import(".prisma/client").$Enums.BillType;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidBy: string | null;
        note: string | null;
        monthYear: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByMonth(year: number, month: number): Promise<{
        paidByName: string;
        payer: {
            id: string;
            email: string;
            name: string;
            phone: string;
        };
        billType: import(".prisma/client").$Enums.BillType;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidBy: string | null;
        note: string | null;
        monthYear: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
                email: string;
                name: string;
                phone: string;
            };
            billType: import(".prisma/client").$Enums.BillType;
            amount: import("@prisma/client/runtime/library").Decimal;
            paidBy: string | null;
            note: string | null;
            monthYear: Date;
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
            email: string;
            name: string;
            phone: string;
        };
        billType: import(".prisma/client").$Enums.BillType;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidBy: string | null;
        note: string | null;
        monthYear: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeByMonth(year: number, month: number): Promise<{
        message: string;
        count: number;
    }>;
}
