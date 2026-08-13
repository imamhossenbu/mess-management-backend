import { PrismaService } from "../../prisma/prisma.service";
import { CreatePaymentDto, UpdatePaymentDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class PaymentsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(messId: string, createPaymentDto: CreatePaymentDto): Promise<{
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        memberId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    findAll(messId: string): Promise<({
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        memberId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    })[]>;
    findOne(messId: string, id: string): Promise<{
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        memberId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    findByUser(messId: string, userId: string, startDate?: Date, endDate?: Date): Promise<({
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        memberId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    })[]>;
    findByDate(messId: string, date: Date): Promise<({
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        memberId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    })[]>;
    findByMonth(messId: string, year: number, month: number): Promise<({
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        memberId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
    })[]>;
    getMonthlySummary(messId: string, year: number, month: number): Promise<{
        month: string;
        year: number;
        totalPayments: number;
        totalAmount: number;
        payments: ({
            member: {
                user: {
                    id: string;
                    name: string;
                    phone: string;
                };
            } & {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                messId: string;
                role: import(".prisma/client").$Enums.MessRole;
                roles: import(".prisma/client").$Enums.MessRole[];
                joinedDate: Date;
                leftDate: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            messId: string;
            memberId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        })[];
    }>;
    getUserBalance(messId: string, userId: string): Promise<{
        userId: string;
        userName: string;
        totalPaid: number;
        balance: number;
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            messId: string;
            memberId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        }[];
    }>;
    getAllUserBalances(messId: string): Promise<{
        userId: string;
        userName: string;
        phone: string;
        totalPaid: number;
        balance: number;
    }[]>;
    update(messId: string, id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        member: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messId: string;
        memberId: string;
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
