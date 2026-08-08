// src/modules/notifications/dto/create-notification.dto.ts
import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsBoolean,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { NotificationType } from "@prisma/client";

export class CreateNotificationDto {
  @ApiProperty({ example: "user-id-123" })
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: NotificationType, example: "BILL" })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: "মাসিক বিল" })
  @IsString()
  title: string;

  @ApiProperty({ example: "আপনার এই মাসের বিল ১০,৫৫০ টাকা" })
  @IsString()
  message: string;

  @ApiProperty({ example: "/bills", required: false })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}

export class SendEmailDto {
  @ApiProperty({ example: "user@example.com" })
  @IsString()
  email: string;

  @ApiProperty({ example: "মাসিক বিল" })
  @IsString()
  subject: string;

  @ApiProperty({ example: "আপনার এই মাসের বিল ১০,৫৫০ টাকা" })
  @IsString()
  message: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  html?: string;
}

export class BulkNotificationDto {
  @ApiProperty({ type: [String], example: ["user-id-1", "user-id-2"] })
  @IsUUID("4", { each: true })
  userIds: string[];

  @ApiProperty({ enum: NotificationType, example: "BILL" })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: "মাসিক বিল" })
  @IsString()
  title: string;

  @ApiProperty({ example: "আপনার এই মাসের বিল তৈরি হয়েছে" })
  @IsString()
  message: string;

  @ApiProperty({ example: "/bills", required: false })
  @IsString()
  @IsOptional()
  link?: string;
}
