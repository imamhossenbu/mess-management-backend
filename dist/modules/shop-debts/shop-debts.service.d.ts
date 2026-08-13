import { PrismaService } from "../../prisma/prisma.service";
import { CreateShopDebtDto, UpdateShopDebtDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class ShopDebtsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(messId: string, createShopDebtDto: CreateShopDebtDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        shopName: string;
        note: string | null;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }>;
    payDebt(messId: string, id: string, paidDate?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        shopName: string;
        note: string | null;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }>;
    findAll(messId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        shopName: string;
        note: string | null;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }[]>;
    findOne(messId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        shopName: string;
        note: string | null;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }>;
    findByShop(messId: string, shopName: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        shopName: string;
        note: string | null;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }[]>;
    findByDate(messId: string, date: Date): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        shopName: string;
        note: string | null;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }[]>;
    findByMonth(messId: string, year: number, month: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        shopName: string;
        note: string | null;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }[]>;
    getSummary(messId: string): Promise<{
        totalDue: number;
        totalPaid: number;
        totalAmount: number;
        shopWiseSummary: {
            totalDue: number;
            totalPaid: number;
            totalAmount: number;
            shopName: string;
        }[];
    }>;
    getMonthlySummary(messId: string, year: number, month: number): Promise<{
        month: string;
        year: number;
        totalDebt: number;
        totalPaid: number;
        currentDue: number;
        debts: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            messId: string;
            date: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            shopName: string;
            note: string | null;
            itemDetails: string | null;
            status: import(".prisma/client").$Enums.DebtStatus;
            paidDate: Date | null;
        }[];
    }>;
    update(messId: string, id: string, updateShopDebtDto: UpdateShopDebtDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        shopName: string;
        note: string | null;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }>;
    remove(messId: string, id: string): Promise<{
        message: string;
    }>;
    private updateMonthlySummary;
    getMonthlySummaryReport(messId: string, year: number, month: number): Promise<{
        month: string;
        year: number;
        totalDebt: number;
        totalPaid: number;
        currentDue: number;
        message: string;
    } | {
        month: string;
        year: number;
        totalDebt: number;
        totalPaid: number;
        currentDue: number;
        message?: undefined;
    }>;
}
