import { PrismaService } from "../../prisma/prisma.service";
import { CreateNotificationDto, BulkNotificationDto, SendEmailDto } from "./dto";
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createNotificationDto: CreateNotificationDto): Promise<{
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        userId: string;
        message: string;
        link: string | null;
        isRead: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createBulk(bulkNotificationDto: BulkNotificationDto): Promise<{
        message: string;
        count: number;
        notifications: {
            type: import(".prisma/client").$Enums.NotificationType;
            title: string;
            userId: string;
            message: string;
            link: string | null;
            isRead: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    findAll(): Promise<({
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        userId: string;
        message: string;
        link: string | null;
        isRead: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        userId: string;
        message: string;
        link: string | null;
        isRead: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByUser(userId: string): Promise<({
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        userId: string;
        message: string;
        link: string | null;
        isRead: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: string): Promise<{
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        userId: string;
        message: string;
        link: string | null;
        isRead: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
            userId: string;
            message: string;
            email: string;
            subject: string;
            html: string | null;
            id: string;
            createdAt: Date;
            sentAt: Date;
        };
    }>;
    sendBillNotification(userId: string, billAmount: number, dueDate: Date): Promise<{
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        userId: string;
        message: string;
        link: string | null;
        isRead: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    sendPaymentConfirmation(userId: string, amount: number): Promise<{
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        userId: string;
        message: string;
        link: string | null;
        isRead: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    sendMealReminder(userId: string, mealType: string): Promise<{
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        userId: string;
        message: string;
        link: string | null;
        isRead: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
