import { ShopDebtsService } from "./shop-debts.service";
import { CreateShopDebtDto, UpdateShopDebtDto, CreateShopPaymentDto } from "./dto";
export declare class ShopDebtsController {
    private readonly shopDebtsService;
    constructor(shopDebtsService: ShopDebtsService);
    createDebt(createShopDebtDto: CreateShopDebtDto, req: any): Promise<{
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
    createPayment(createShopPaymentDto: CreateShopPaymentDto, req: any): Promise<{
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
    getMonthlyData(year?: number, month?: number): Promise<{
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
    removeDebt(id: string): Promise<{
        message: string;
    }>;
    removePayment(id: string): Promise<{
        message: string;
    }>;
}
