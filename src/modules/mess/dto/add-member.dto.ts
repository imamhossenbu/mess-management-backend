// src/modules/mess/dto/add-member.dto.ts
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddMemberDto {
  @ApiProperty({ required: false, description: "Pending registered user's ID" })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false })
  @ValidateIf((dto) => !dto.userId)
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @ValidateIf((dto) => !dto.userId)
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, minLength: 6 })
  @ValidateIf((dto) => !dto.userId)
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ enum: ["SUPER_ADMIN", "ADMIN", "MEMBER"], default: "MEMBER" })
  @IsEnum(["SUPER_ADMIN", "ADMIN", "MEMBER"])
  @IsOptional()
  role?: string;

  @ApiProperty({ enum: ["SUPER_ADMIN", "ADMIN", "MEMBER"], isArray: true, required: false })
  @IsArray()
  @IsEnum(["SUPER_ADMIN", "ADMIN", "MEMBER"], { each: true })
  @IsOptional()
  roles?: string[];
}
