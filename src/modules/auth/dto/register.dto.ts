// src/modules/auth/dto/register.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER",
}

export class RegisterDto {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  name: string;

  @ApiProperty({ example: "01712345678" })
  @IsString()
  phone: string;

  @ApiProperty({ example: "john@example.com", required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "Room-101", required: false })
  @IsString()
  @IsOptional()
  roomNumber?: string;

  @ApiProperty({ enum: Role, default: Role.MEMBER })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
