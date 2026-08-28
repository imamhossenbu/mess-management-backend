import { PrismaService } from "../../prisma/prisma.service";
import { CreateShopDebtDto, UpdateShopDebtDto } from "./dto";
import { CreateShopPaymentDto } from "./dto/create-shop-payment.dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class ShopDebtsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    createDebt(createShopDebtDto: CreateShopDebtDto, userId: string): Promise<{
        recordedBy: {
            name: string;
        };
    } & {
        id: string;
        shopName: string;
        date: Date;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        recordedById: string | null;
    }>;
    createPayment(createShopPaymentDto: CreateShopPaymentDto, userId: string): Promise<{
        paidBy: {
            name: string;
        };
    } & {
        id: string;
        shopName: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
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
    getMonthlyData(year: number, month: number): Promise<{
        month: string;
        year: number;
        debts: {
            amount: number;
            recordedByName: string;
            recordedBy: {
                name: string;
            };
            id: string;
            shopName: string;
            date: Date;
            itemDetails: string | null;
            note: string | null;
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
            id: string;
            shopName: string;
            date: Date;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            paidById: string | null;
        }[];
    }>;
    updateDebt(id: string, updateShopDebtDto: UpdateShopDebtDto): Promise<{
        id: string;
        shopName: string;
        date: Date;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        recordedById: string | null;
    }>;
    removeDebt(id: string): Promise<{
        message: string;
    }>;
    updatePayment(id: string, updateShopPaymentDto: any): Promise<{
        id: string;
        shopName: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidById: string | null;
    }>;
    removePayment(id: string): Promise<{
        message: string;
    }>;
}
