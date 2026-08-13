import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto, BulkNotificationDto, SendEmailDto } from "./dto";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
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
    sendBillNotification(userId: string, amount: number, dueDate: string): Promise<{
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
    sendMonthlySummary(year: number, month: number): Promise<{
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
    getMyNotifications(req: any): Promise<({
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
    getUnreadCount(req: any): Promise<{
        unreadCount: number;
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
    markAllAsRead(req: any): Promise<{
        message: string;
        count: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeAll(req: any): Promise<{
        message: string;
        count: number;
    }>;
}
