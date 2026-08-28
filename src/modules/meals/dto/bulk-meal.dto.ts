// src/modules/meals/dto/bulk-meal.dto.ts
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BulkMealEntryDto {
  @ApiProperty({ example: "2026-08-08" })
  @IsDateString()
  date: string;


  @ApiProperty({ description: "Lunch (দুপুর)" })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  lunchUserIds?: string[];

  @ApiProperty({ description: "Dinner (রাত)" })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dinnerUserIds?: string[];
}

export class SingleMealEntryDto {
  @ApiProperty({ example: "2026-08-08" })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: ["lunch", "dinner"] })
  @IsString()
  mealType: "lunch" | "dinner";

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}
