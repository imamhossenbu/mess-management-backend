// src/modules/notifications/dto/update-notification.dto.ts
import { IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateNotificationDto {
  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}

export class MarkAllReadDto {
  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}
