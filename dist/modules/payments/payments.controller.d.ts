import { PaymentsService } from "./payments.service";
import { CreatePaymentDto, UpdatePaymentDto } from "./dto";
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: CreatePaymentDto): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findAll(): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    getAllUserBalances(): Promise<import("../dashboard/dto").MemberBalanceDto[]>;
    getMonthlySummary(year?: number, month?: number): Promise<{
        month: string;
        year: number;
        totalPayments: number;
        totalAmount: number;
        payments: {
            userName: string;
            user: {
                id: string;
                name: string;
                email: string;
                phone: string;
            };
            id: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        }[];
    }>;
    findByUser(userId: string, startDate?: string, endDate?: string): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    getUserBalance(userId: string): Promise<{
        userId: string;
        userName: string;
        totalPaid: number;
        balance: number;
        payments: {
            amount: number;
            id: string;
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        }[];
    }>;
    findByDate(date: string): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    findByMonth(year: number, month: number): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    findOne(id: string): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
