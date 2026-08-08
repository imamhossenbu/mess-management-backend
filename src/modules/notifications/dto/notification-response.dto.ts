// src/modules/notifications/dto/notification-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { NotificationType } from "@prisma/client";

export class NotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  type: NotificationType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  link?: string;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UnreadCountDto {
  @ApiProperty()
  unreadCount: number;
}
