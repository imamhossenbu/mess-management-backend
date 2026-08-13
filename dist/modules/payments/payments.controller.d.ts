import { PaymentsService } from "./payments.service";
import { CreatePaymentDto, UpdatePaymentDto } from "./dto";
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
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
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
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
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    })[]>;
    getAllUserBalances(messId: string): Promise<{
        userId: string;
        userName: string;
        phone: string;
        totalPaid: number;
        balance: number;
    }[]>;
    getMonthlySummary(messId: string, year?: number, month?: number): Promise<{
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
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            note: string | null;
        })[];
    }>;
    findByUser(messId: string, userId: string, startDate?: string, endDate?: string): Promise<({
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
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    })[]>;
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
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            note: string | null;
        }[];
    }>;
    findByDate(messId: string, date: string): Promise<({
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
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
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
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
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
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }>;
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
        paymentDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        note: string | null;
    }>;
    remove(messId: string, id: string): Promise<{
        message: string;
    }>;
}
