import { PrismaService } from "../../prisma/prisma.service";
import { CreateMarketingDto, UpdateMarketingDto } from "./dto";
import { InventoryService } from "../inventory/inventory.service";
import { NotificationsService } from "../notifications/notifications.service";
export declare class MarketingsService {
    private prisma;
    private inventoryService;
    private notificationsService;
    constructor(prisma: PrismaService, inventoryService: InventoryService, notificationsService: NotificationsService);
    create(messId: string, userId: string, createMarketingDto: CreateMarketingDto): Promise<{
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
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
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
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
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
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
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
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
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
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
    })[]>;
    getDailySummary(messId: string, date: Date): Promise<{
        date: string;
        totalAmount: number;
        totalCash: number;
        totalDebt: number;
        totalSelf: number;
        totalItems: number;
        items: ({
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
            date: Date;
            itemName: string;
            quantity: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            shopName: string | null;
            note: string | null;
        })[];
    }>;
    getMonthlySummary(messId: string, year: number, month: number): Promise<{
        month: string;
        year: number;
        totalAmount: number;
        totalCash: number;
        totalDebt: number;
        totalSelf: number;
        totalItems: number;
        categorySummary: {
            itemName: string;
            totalAmount: number;
            count: number;
        }[];
    }>;
    update(messId: string, id: string, updateMarketingDto: UpdateMarketingDto): Promise<{
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
        date: Date;
        itemName: string;
        quantity: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        shopName: string | null;
        note: string | null;
    }>;
    remove(messId: string, id: string): Promise<{
        message: string;
    }>;
    removeByDate(messId: string, date: Date): Promise<{
        message: string;
        count: number;
    }>;
    private updateDailySummary;
}
