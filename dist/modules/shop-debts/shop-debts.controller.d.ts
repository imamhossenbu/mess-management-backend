import { ShopDebtsService } from "./shop-debts.service";
import { CreateShopDebtDto, UpdateShopDebtDto } from "./dto";
export declare class ShopDebtsController {
    private readonly shopDebtsService;
    constructor(shopDebtsService: ShopDebtsService);
    create(messId: string, createShopDebtDto: CreateShopDebtDto): Promise<{
        id: string;
        date: Date;
        shopName: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }>;
    payDebt(messId: string, id: string, paidDate?: string): Promise<{
        id: string;
        date: Date;
        shopName: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }>;
    findAll(messId: string): Promise<{
        id: string;
        date: Date;
        shopName: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
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
    getMonthlySummary(messId: string, year?: number, month?: number): Promise<{
        month: string;
        year: number;
        totalDebt: number;
        totalPaid: number;
        currentDue: number;
        debts: {
            id: string;
            date: Date;
            shopName: string;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            itemDetails: string | null;
            status: import(".prisma/client").$Enums.DebtStatus;
            paidDate: Date | null;
        }[];
    }>;
    getMonthlyReport(messId: string, year: number, month: number): Promise<{
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
    findByShop(messId: string, shopName: string): Promise<{
        id: string;
        date: Date;
        shopName: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }[]>;
    findByDate(messId: string, date: string): Promise<{
        id: string;
        date: Date;
        shopName: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }[]>;
    findByMonth(messId: string, year: number, month: number): Promise<{
        id: string;
        date: Date;
        shopName: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }[]>;
    findOne(messId: string, id: string): Promise<{
        id: string;
        date: Date;
        shopName: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }>;
    update(messId: string, id: string, updateShopDebtDto: UpdateShopDebtDto): Promise<{
        id: string;
        date: Date;
        shopName: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        itemDetails: string | null;
        status: import(".prisma/client").$Enums.DebtStatus;
        paidDate: Date | null;
    }>;
    remove(messId: string, id: string): Promise<{
        message: string;
    }>;
}
