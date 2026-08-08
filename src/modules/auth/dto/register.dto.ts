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

  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "01712345678", required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: "Room-101", required: false })
  @IsString()
  @IsOptional()
  roomNumber?: string;

  @ApiProperty({ enum: Role, default: Role.MEMBER })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
