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
            email: string;
            id: string;
            name: string;
            phone: string;
        };
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }>;
    findAll(): Promise<{
        userName: string;
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }[]>;
    findOne(id: string): Promise<{
        userName: string;
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }>;
    findByUser(userId: string, startDate?: Date, endDate?: Date): Promise<{
        userName: string;
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }[]>;
    findByDate(date: Date): Promise<{
        userName: string;
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }[]>;
    findByMonth(year: number, month: number): Promise<{
        userName: string;
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }[]>;
    getMonthlySummary(year: number, month: number): Promise<{
        month: string;
        year: number;
        totalPayments: number;
        totalAmount: number;
        payments: {
            userName: string;
            user: {
                email: string;
                id: string;
                name: string;
                phone: string;
            };
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
    getUserBalance(userId: string): Promise<{
        userId: string;
        userName: string;
        totalPaid: number;
        balance: number;
        payments: {
            amount: number;
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            note: string | null;
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
            email: string;
            id: string;
            name: string;
            phone: string;
        };
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private updateUserBalance;
}
