import { PrismaService } from "../../prisma/prisma.service";
import { CreatePaymentDto, UpdatePaymentDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
import { DashboardService } from "../dashboard/dashboard.service";
export declare class PaymentsService {
    private prisma;
    private notificationsService;
    private dashboardService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, dashboardService: DashboardService);
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
    findByUser(userId: string, startDate?: Date, endDate?: Date): Promise<{
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
    findByDate(date: Date): Promise<{
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
    getAllUserBalances(): Promise<import("../dashboard/dto").MemberBalanceDto[]>;
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
    private updateUserBalance;
}
