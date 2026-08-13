import { PrismaService } from "../../prisma/prisma.service";
import { CreatePaymentDto, UpdatePaymentDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class PaymentsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
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
    findByUser(messId: string, userId: string, startDate?: Date, endDate?: Date): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }[]>;
    findByDate(messId: string, date: Date): Promise<{
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
    getMonthlySummary(messId: string, year: number, month: number): Promise<{
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
    getUserBalance(messId: string, userId: string): Promise<{
        userId: any;
        userName: any;
        totalPaid: any;
        balance: number;
        payments: any;
    }>;
    getAllUserBalances(messId: string): Promise<any>;
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
    private updateUserBalance;
}
