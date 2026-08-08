import { NotificationType } from "@prisma/client";
export declare class CreateNotificationDto {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    isRead?: boolean;
}
export declare class SendEmailDto {
    email: string;
    subject: string;
    message: string;
    html?: string;
}
export declare class BulkNotificationDto {
    userIds: string[];
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
}
