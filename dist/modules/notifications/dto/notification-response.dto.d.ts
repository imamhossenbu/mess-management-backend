import { NotificationType } from "@prisma/client";
export declare class NotificationResponseDto {
    id: string;
    userId: string;
    userName: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UnreadCountDto {
    unreadCount: number;
}
