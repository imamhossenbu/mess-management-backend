// src/modules/meals/dto/create-meal.dto.ts
import { IsString, IsBoolean, IsOptional, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMealDto {
  @ApiProperty({ example: "user-id-123" })
  @IsString()
  userId: string;

  @ApiProperty({ example: "2026-08-08" })
  @IsDateString()
  @IsOptional()
  date?: string;


  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  lunch?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  dinner?: boolean;
}
