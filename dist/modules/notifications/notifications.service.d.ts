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
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    createBulk(bulkNotificationDto: BulkNotificationDto): Promise<{
        message: string;
        count: number;
        notifications: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            link: string | null;
            message: string;
            type: import(".prisma/client").$Enums.NotificationType;
            title: string;
            isRead: boolean;
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
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    findByUser(userId: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
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
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
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
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
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
            userId: string;
            createdAt: Date;
            email: string;
            message: string;
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
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    sendPaymentConfirmation(userId: string, amount: number): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    sendMealReminder(userId: string, mealType: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        link: string | null;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
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
