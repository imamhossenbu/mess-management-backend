import { PrismaService } from "../../prisma/prisma.service";
import { CreatePaymentDto, UpdatePaymentDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class PaymentsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(createPaymentDto: CreatePaymentDto): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    findByUser(userId: string, startDate?: Date, endDate?: Date): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }[]>;
    findByDate(date: Date): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }[]>;
    getMonthlySummary(year: number, month: number): Promise<{
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
            amount: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        }[];
    }>;
    getUserBalance(userId: string): Promise<{
        userId: string;
        userName: string;
        totalPaid: number;
        balance: number;
        payments: {
            amount: number;
            note: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        }[];
    }>;
    getAllUserBalances(): Promise<{
        userId: string;
        userName: string;
        phone: string;
        email: string;
        totalPaid: number;
        balance: number;
    }[]>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        userName: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private updateUserBalance;
}
