import { PrismaService } from "../../prisma/prisma.service";
import { CreatePaymentDto, UpdatePaymentDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class PaymentsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(messId: string, createPaymentDto: CreatePaymentDto): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    findAll(messId: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }[]>;
    findOne(messId: string, id: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    findByUser(messId: string, userId: string, startDate?: Date, endDate?: Date): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }[]>;
    findByDate(messId: string, date: Date): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }[]>;
    findByMonth(messId: string, year: number, month: number): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }[]>;
    getMonthlySummary(messId: string, year: number, month: number): Promise<{
        month: string;
        year: number;
        totalPayments: number;
        totalAmount: number;
        payments: {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        }[];
    }>;
    getUserBalance(messId: string, userId: string): Promise<{
        userId: any;
        userName: any;
        totalPaid: any;
        balance: number;
        payments: any;
    }>;
    getAllUserBalances(messId: string): Promise<any>;
    update(messId: string, id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    remove(messId: string, id: string): Promise<{
        message: string;
    }>;
    private updateUserBalance;
}
