import { PaymentsService } from "./payments.service";
import { CreatePaymentDto, UpdatePaymentDto } from "./dto";
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(messId: string, createPaymentDto: CreatePaymentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }>;
    findAll(messId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }[]>;
    getAllUserBalances(messId: string): Promise<any>;
    getMonthlySummary(messId: string, year?: number, month?: number): Promise<{
        month: string;
        year: number;
        totalPayments: number;
        totalAmount: number;
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            note: string | null;
        }[];
    }>;
    findByUser(messId: string, userId: string, startDate?: string, endDate?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }[]>;
    findByMonth(messId: string, year: number, month: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }[]>;
    findOne(messId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }>;
    update(messId: string, id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }>;
    remove(messId: string, id: string): Promise<{
        message: string;
    }>;
}
