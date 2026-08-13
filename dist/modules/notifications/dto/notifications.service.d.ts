import { PrismaService } from "../../prisma/prisma.service";
import { CreateNotificationDto, BulkNotificationDto, SendEmailDto } from "./dto";
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createNotificationDto: CreateNotificationDto): Promise<any>;
    createBulk(bulkNotificationDto: BulkNotificationDto): Promise<{
        message: string;
        count: any;
        notifications: any;
    }>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    findByUser(userId: string): Promise<any>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: any;
    }>;
    markAsRead(id: string): Promise<any>;
    markAllAsRead(userId: string): Promise<{
        message: string;
        count: any;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeAll(userId: string): Promise<{
        message: string;
        count: any;
    }>;
    sendEmail(sendEmailDto: SendEmailDto): Promise<{
        message: string;
        emailLog: any;
    }>;
    sendBillNotification(userId: string, billAmount: number, dueDate: Date): Promise<any>;
    sendPaymentConfirmation(userId: string, amount: number): Promise<any>;
    sendMealReminder(userId: string, mealType: string): Promise<any>;
    sendInventoryAlert(type: string, quantity: number): Promise<{
        message: string;
        count: any;
    }>;
    sendMonthlySummaryNotification(year: number, month: number): Promise<{
        message: string;
        count: any;
    }>;
}
