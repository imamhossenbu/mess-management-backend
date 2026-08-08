import { PaymentsService } from "./payments.service";
import { CreatePaymentDto, UpdatePaymentDto } from "./dto";
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: CreatePaymentDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    getAllUserBalances(): Promise<{
        userId: string;
        userName: string;
        phone: string;
        totalPaid: number;
        balance: number;
    }[]>;
    getMonthlySummary(year?: number, month?: number): Promise<{
        month: string;
        year: number;
        totalPayments: number;
        totalAmount: number;
        payments: ({
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        })[];
    }>;
    findByUser(userId: string, startDate?: string, endDate?: string): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    getUserBalance(userId: string): Promise<{
        userId: string;
        userName: string;
        totalPaid: number;
        balance: number;
        payments: {
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
    findByDate(date: string): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findByMonth(year: number, month: number): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
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
        user: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
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
