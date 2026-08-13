import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto, BulkNotificationDto, SendEmailDto } from "./dto";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create(createNotificationDto: CreateNotificationDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            link: string | null;
            message: string;
            type: import(".prisma/client").$Enums.NotificationType;
            title: string;
            isRead: boolean;
        }[];
    }>;
    sendBillNotification(userId: string, amount: number, dueDate: string): Promise<{
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
            phone: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
            phone: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
    sendMonthlySummary(year: number, month: number): Promise<{
        message: string;
        count: number;
    }>;
    sendEmail(sendEmailDto: SendEmailDto): Promise<{
        message: string;
        emailLog: {
            id: string;
            email: string;
            createdAt: Date;
            userId: string;
            message: string;
            subject: string;
            html: string | null;
            sentAt: Date;
        };
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        link: string | null;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    })[]>;
    getMyNotifications(req: any): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        link: string | null;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    })[]>;
    getUnreadCount(req: any): Promise<{
        unreadCount: number;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
            phone: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        link: string | null;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        link: string | null;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
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
