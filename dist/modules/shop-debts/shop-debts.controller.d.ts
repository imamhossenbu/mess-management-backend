import { ShopDebtsService } from "./shop-debts.service";
import { CreateShopDebtDto, UpdateShopDebtDto } from "./dto";
export declare class ShopDebtsController {
    private readonly shopDebtsService;
    constructor(shopDebtsService: ShopDebtsService);
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
    findByDate(date: string): Promise<{
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
}
