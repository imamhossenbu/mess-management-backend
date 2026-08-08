import { PrismaService } from "../../prisma/prisma.service";
import { CreateNotificationDto, BulkNotificationDto, SendEmailDto } from "./dto";
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createNotificationDto: CreateNotificationDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        link: string | null;
        isRead: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    createBulk(bulkNotificationDto: BulkNotificationDto): Promise<{
        message: string;
        count: number;
        notifications: {
            id: string;
            type: import(".prisma/client").$Enums.NotificationType;
            title: string;
            message: string;
            link: string | null;
            isRead: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        }[];
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        link: string | null;
        isRead: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        link: string | null;
        isRead: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findByUser(userId: string): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        link: string | null;
        isRead: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: string): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        link: string | null;
        isRead: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
        count: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeAll(userId: string): Promise<{
        message: string;
        count: number;
    }>;
    sendEmail(sendEmailDto: SendEmailDto): Promise<{
        message: string;
        emailLog: {
            id: string;
            message: string;
            createdAt: Date;
            userId: string;
            email: string;
            subject: string;
            html: string | null;
            sentAt: Date;
        };
    }>;
    sendBillNotification(userId: string, billAmount: number, dueDate: Date): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        link: string | null;
        isRead: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    sendPaymentConfirmation(userId: string, amount: number): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        link: string | null;
        isRead: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    sendMealReminder(userId: string, mealType: string): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        link: string | null;
        isRead: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    sendInventoryAlert(type: string, quantity: number): Promise<{
        message: string;
        count: number;
    }>;
    sendMonthlySummaryNotification(year: number, month: number): Promise<{
        message: string;
        count: number;
    }>;
}
