// src/modules/users/dto/update-user.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../auth/dto/register.dto";

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  roomNumber?: string;

  @ApiProperty({ enum: Role, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
