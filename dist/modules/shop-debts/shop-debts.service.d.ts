import { PrismaService } from "../../prisma/prisma.service";
import { CreateShopDebtDto, UpdateShopDebtDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class ShopDebtsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(createShopDebtDto: CreateShopDebtDto): Promise<{
        id: string;
        shopName: string;
        date: Date;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    payDebt(id: string, paidDate?: string): Promise<{
        id: string;
        shopName: string;
        date: Date;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        shopName: string;
        date: Date;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        shopName: string;
        date: Date;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByShop(shopName: string): Promise<{
        id: string;
        shopName: string;
        date: Date;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByDate(date: Date): Promise<{
        id: string;
        shopName: string;
        date: Date;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByMonth(year: number, month: number): Promise<{
        id: string;
        shopName: string;
        date: Date;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getSummary(): Promise<{
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
    getMonthlySummary(year: number, month: number): Promise<{
        month: string;
        year: number;
        totalDebt: number;
        totalPaid: number;
        currentDue: number;
        debts: {
            id: string;
            shopName: string;
            date: Date;
            itemDetails: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.DebtStatus;
            paidDate: Date | null;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    update(id: string, updateShopDebtDto: UpdateShopDebtDto): Promise<{
        id: string;
        shopName: string;
        date: Date;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private updateMonthlySummary;
    getMonthlySummaryReport(year: number, month: number): Promise<{
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
