// src/modules/mess/dto/create-mess.dto.ts
import {
  IsString,
  IsOptional,
  IsEmail,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMessDto {
  @ApiProperty({ example: "My Mess" })
  @IsString()
  name: string;

  @ApiProperty({ example: "A great mess for students", required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: "123 Main Street, Dhaka", required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: "01712345678", required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: "mess@example.com", required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: "Dhaka", required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: "Bangladesh", required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 10, required: false })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  maxMembers?: number;

  @ApiProperty({ example: "https://example.com/logo.png", required: false })
  @IsString()
  @IsOptional()
  logo?: string;
}
