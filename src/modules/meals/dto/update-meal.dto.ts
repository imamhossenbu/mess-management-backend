// src/modules/meals/dto/update-meal.dto.ts
import { IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateMealDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  morning?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  lunch?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  dinner?: boolean;
}
