import { ShopDebtsService } from "./shop-debts.service";
import { CreateShopDebtDto, UpdateShopDebtDto } from "./dto";
export declare class ShopDebtsController {
    private readonly shopDebtsService;
    constructor(shopDebtsService: ShopDebtsService);
    create(createShopDebtDto: CreateShopDebtDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        shopName: string;
        status: import(".prisma/client").$Enums.DebtStatus;
        itemDetails: string | null;
        paidDate: Date | null;
    }>;
    payDebt(id: string, paidDate?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        shopName: string;
        status: import(".prisma/client").$Enums.DebtStatus;
        itemDetails: string | null;
        paidDate: Date | null;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        shopName: string;
        status: import(".prisma/client").$Enums.DebtStatus;
        itemDetails: string | null;
        paidDate: Date | null;
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
    getMonthlySummary(year?: number, month?: number): Promise<{
        month: string;
        year: number;
        totalDebt: number;
        totalPaid: number;
        currentDue: number;
        debts: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            shopName: string;
            status: import(".prisma/client").$Enums.DebtStatus;
            itemDetails: string | null;
            paidDate: Date | null;
        }[];
    }>;
    getMonthlyReport(year: number, month: number): Promise<{
        month: string;
        year: number;
        totalDebt: number;
        totalPaid: number;
        currentDue: number;
        totalEntries: number;
    }>;
    findByShop(shopName: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        shopName: string;
        status: import(".prisma/client").$Enums.DebtStatus;
        itemDetails: string | null;
        paidDate: Date | null;
    }[]>;
    findByDate(date: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        shopName: string;
        status: import(".prisma/client").$Enums.DebtStatus;
        itemDetails: string | null;
        paidDate: Date | null;
    }[]>;
    findByMonth(year: number, month: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        shopName: string;
        status: import(".prisma/client").$Enums.DebtStatus;
        itemDetails: string | null;
        paidDate: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        shopName: string;
        status: import(".prisma/client").$Enums.DebtStatus;
        itemDetails: string | null;
        paidDate: Date | null;
    }>;
    update(id: string, updateShopDebtDto: UpdateShopDebtDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        shopName: string;
        status: import(".prisma/client").$Enums.DebtStatus;
        itemDetails: string | null;
        paidDate: Date | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
