import { ShopDebtsService } from "./shop-debts.service";
import { CreateShopDebtDto, UpdateShopDebtDto, CreateShopPaymentDto, CreateBulkShopDebtDto } from "./dto";
export declare class ShopDebtsController {
    private readonly shopDebtsService;
    constructor(shopDebtsService: ShopDebtsService);
    createDebt(createShopDebtDto: CreateShopDebtDto, req: any): Promise<{
        recordedBy: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        shopName: string;
        note: string | null;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        recordedById: string | null;
    }>;
    createBulkDebt(createBulkShopDebtDto: CreateBulkShopDebtDto, req: any): Promise<any[]>;
    createPayment(createShopPaymentDto: CreateShopPaymentDto, req: any): Promise<{
        paidBy: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        shopName: string;
        note: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
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
    getMonthlyData(year?: string, month?: string, startDate?: string, endDate?: string): Promise<{
        month: string;
        year: number;
        debts: {
            amount: number;
            recordedByName: string;
            recordedBy: {
                name: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            shopName: string;
            note: string | null;
            itemDetails: string | null;
            recordedById: string | null;
        }[];
        payments: {
            amount: number;
            paidByName: string;
            paidBy: {
                name: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            shopName: string;
            note: string | null;
            paidById: string | null;
        }[];
    }>;
    updateDebt(id: string, updateShopDebtDto: UpdateShopDebtDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        shopName: string;
        note: string | null;
        itemDetails: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        recordedById: string | null;
    }>;
    updatePayment(id: string, updateShopPaymentDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        shopName: string;
        note: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidById: string | null;
    }>;
    removeDebt(id: string): Promise<{
        message: string;
    }>;
    removePayment(id: string): Promise<{
        message: string;
    }>;
}
