import { PrismaService } from "../../prisma/prisma.service";
import { CreateNotificationDto, UpdateNotificationDto, BulkNotificationDto, SendEmailDto } from "./dto";
import { EmailService } from "./email.service";
export declare class NotificationsService {
    private prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    create(createNotificationDto: CreateNotificationDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        isRead: boolean;
        userId: string;
    }>;
    createBulk(bulkNotificationDto: BulkNotificationDto): Promise<{
        message: string;
        count: number;
        notifications: {
            type: import(".prisma/client").$Enums.NotificationType;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            link: string | null;
            message: string;
            isRead: boolean;
            userId: string;
        }[];
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        isRead: boolean;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        isRead: boolean;
        userId: string;
    }>;
    findByUser(userId: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        isRead: boolean;
        userId: string;
    })[]>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        isRead: boolean;
        userId: string;
    }>;
    markMultipleAsRead(ids: string[]): Promise<{
        message: string;
        count: number;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
        count: number;
    }>;
    update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        isRead: boolean;
        userId: string;
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
            createdAt: Date;
            email: string;
            message: string;
            userId: string;
            subject: string;
            html: string | null;
            sentAt: Date;
        };
    }>;
    sendBillNotification(userId: string, billAmount: number, dueDate: Date): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        isRead: boolean;
        userId: string;
    }>;
    sendPaymentConfirmation(userId: string, amount: number): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        isRead: boolean;
        userId: string;
    }>;
    sendMealReminder(userId: string, mealType: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        isRead: boolean;
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
