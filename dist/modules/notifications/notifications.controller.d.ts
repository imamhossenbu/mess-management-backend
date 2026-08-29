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
    sendBillNotification(userId: string, amount: number, dueDate: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
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
            email: string;
            phone: string;
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
            email: string;
            phone: string;
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
    sendMonthlySummary(year: number, month: number): Promise<{
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
    findAll(): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
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
    getMyNotifications(req: any): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
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
            email: string;
            phone: string;
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
    markAsRead(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
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
