import { PrismaService } from "../../prisma/prisma.service";
import { CreateShopDebtDto, UpdateShopDebtDto, CreateBulkShopDebtDto } from "./dto";
import { CreateShopPaymentDto } from "./dto/create-shop-payment.dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class ShopDebtsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    createDebt(createShopDebtDto: CreateShopDebtDto, userId: string): Promise<any[] | ({
        recordedBy: {
            name: string;
        };
    } & {
        shopName: string;
        date: Date;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        recordedById: string | null;
    })>;
    createBulkDebt(createBulkShopDebtDto: CreateBulkShopDebtDto, userId: string): Promise<any[]>;
    createPayment(createShopPaymentDto: CreateShopPaymentDto, userId: string): Promise<{
        paidBy: {
            name: string;
        };
    } & {
        shopName: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paidById: string | null;
    }>;
    getSummary(): Promise<{
        totalDebt: number;
        totalPaid: number;
        currentDue: number;
        shopWiseSummary: {
            totalDebt: number;
            totalPaid: number;
            currentDue: number;
            shopName: string;
        }[];
    }>;
    getMonthlyData(year: number, month: number, customStartDate?: string, customEndDate?: string): Promise<{
        month: string;
        year: number;
        debts: {
            amount: number;
            recordedByName: string;
            recordedBy: {
                name: string;
            };
            shopName: string;
            date: Date;
            itemDetails: string | null;
            note: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            recordedById: string | null;
        }[];
        payments: {
            amount: number;
            paidByName: string;
            paidBy: {
                name: string;
            };
            shopName: string;
            date: Date;
            note: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paidById: string | null;
        }[];
    }>;
    updateDebt(id: string, updateShopDebtDto: UpdateShopDebtDto): Promise<{
        shopName: string;
        date: Date;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        recordedById: string | null;
    }>;
    removeDebt(id: string): Promise<{
        message: string;
    }>;
    updatePayment(id: string, updateShopPaymentDto: any): Promise<{
        shopName: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paidById: string | null;
    }>;
    removePayment(id: string): Promise<{
        message: string;
    }>;
}
