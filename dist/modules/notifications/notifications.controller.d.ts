import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto, BulkNotificationDto, SendEmailDto } from "./dto";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
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
    sendBillNotification(userId: string, amount: number, dueDate: string): Promise<{
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
    sendMonthlySummary(year: number, month: number): Promise<{
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
    getMyNotifications(req: any): Promise<({
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
    getUnreadCount(req: any): Promise<{
        unreadCount: number;
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
