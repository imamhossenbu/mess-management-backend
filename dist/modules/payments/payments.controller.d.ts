import { PaymentsService } from "./payments.service";
import { CreatePaymentDto, UpdatePaymentDto } from "./dto";
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(messId: string, createPaymentDto: CreatePaymentDto): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }>;
    findAll(messId: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
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
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paymentDate: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            note: string | null;
        }[];
    }>;
    findByUser(messId: string, userId: string, startDate?: string, endDate?: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
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
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }[]>;
    findByMonth(messId: string, year: number, month: number): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }[]>;
    findOne(messId: string, id: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }>;
    update(messId: string, id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }>;
    remove(messId: string, id: string): Promise<{
        message: string;
    }>;
}
