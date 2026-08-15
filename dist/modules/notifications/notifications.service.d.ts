import { PrismaService } from "../../prisma/prisma.service";
import { CreateNotificationDto, UpdateNotificationDto, BulkNotificationDto, SendEmailDto } from "./dto";
import { EmailService } from "./email.service";
export declare class NotificationsService {
    private prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    create(createNotificationDto: CreateNotificationDto): Promise<{
        user: {
            name: string;
            email: string;
            phone: string;
            id: string;
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
            name: string;
            email: string;
            phone: string;
            id: string;
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
            name: string;
            email: string;
            phone: string;
            id: string;
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
            name: string;
            email: string;
            phone: string;
            id: string;
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
            name: string;
            email: string;
            phone: string;
            id: string;
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
            name: string;
            email: string;
            phone: string;
            id: string;
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
            email: string;
            userId: string;
            message: string;
            subject: string;
            html: string | null;
            id: string;
            createdAt: Date;
            sentAt: Date;
        };
    }>;
    sendBillNotification(userId: string, billAmount: number, dueDate: Date): Promise<{
        user: {
            name: string;
            email: string;
            phone: string;
            id: string;
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
            name: string;
            email: string;
            phone: string;
            id: string;
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
            name: string;
            email: string;
            phone: string;
            id: string;
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
