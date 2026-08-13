import { PaymentsService } from "./payments.service";
import { CreatePaymentDto, UpdatePaymentDto } from "./dto";
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(messId: string, createPaymentDto: CreatePaymentDto): Promise<{
        id: string;
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    findAll(messId: string): Promise<{
        id: string;
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }[]>;
    getAllUserBalances(messId: string): Promise<any>;
    getMonthlySummary(messId: string, year?: number, month?: number): Promise<{
        month: string;
        year: number;
        totalPayments: number;
        totalAmount: number;
        payments: {
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
    findByUser(messId: string, userId: string, startDate?: string, endDate?: string): Promise<{
        id: string;
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }[]>;
    getUserBalance(messId: string, userId: string): Promise<{
        userId: any;
        userName: any;
        totalPaid: any;
        balance: number;
        payments: any;
    }>;
    findByDate(messId: string, date: string): Promise<{
        id: string;
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }[]>;
    findByMonth(messId: string, year: number, month: number): Promise<{
        id: string;
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }[]>;
    findOne(messId: string, id: string): Promise<{
        id: string;
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    update(messId: string, id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        id: string;
        userId: string;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    remove(messId: string, id: string): Promise<{
        message: string;
    }>;
}
