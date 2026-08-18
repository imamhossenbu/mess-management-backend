import { ShopDebtsService } from "./shop-debts.service";
import { CreateShopDebtDto, UpdateShopDebtDto } from "./dto";
export declare class ShopDebtsController {
    private readonly shopDebtsService;
    constructor(shopDebtsService: ShopDebtsService);
    create(createShopDebtDto: CreateShopDebtDto): Promise<{
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
    payDebt(id: string, paidDate?: string): Promise<{
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
    findAll(): Promise<{
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
    findByDate(date: string): Promise<{
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
    findByMonth(year: number, month: number): Promise<{
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
    findOne(id: string): Promise<{
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
    update(id: string, updateShopDebtDto: UpdateShopDebtDto): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
}
