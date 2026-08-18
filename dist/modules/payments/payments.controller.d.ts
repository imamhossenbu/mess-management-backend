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
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
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
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }[]>;
    getAllUserBalances(): Promise<{
        userId: string;
        userName: string;
        phone: string;
        email: string;
        totalPaid: number;
        balance: number;
    }[]>;
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
            userId: string;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
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
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }[]>;
    getUserBalance(userId: string): Promise<{
        userId: string;
        userName: string;
        totalPaid: number;
        balance: number;
        payments: {
            amount: number;
            id: string;
            userId: string;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
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
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
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
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
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
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
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
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
