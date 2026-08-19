// src/modules/inventory/dto/update-inventory.dto.ts
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { InventoryCategory } from "@prisma/client";

export class CreateInventoryItemDto {
  @ApiProperty({ example: "Rui Fish" })
  @IsString()
  name: string;

  @ApiProperty({ enum: InventoryCategory, example: "FISH" })
  @IsEnum(InventoryCategory)
  category: InventoryCategory;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  initialQuantity: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(0)
  minStockLevel: number;
}

export class AddInventoryDto {
  @ApiProperty({ example: "Rui Fish" })
  @IsString()
  itemName: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: "Purchase from bazar", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class RemoveInventoryDto {
  @ApiProperty({ example: "Rui Fish" })
  @IsString()
  itemName: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: "Used for cooking", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class SetInventoryDto {
  @ApiProperty({ example: "Rui Fish" })
  @IsString()
  itemName: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: "Stock updated", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateInventoryItemDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: InventoryCategory, required: false })
  @IsEnum(InventoryCategory)
  @IsOptional()
  category?: InventoryCategory;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  minStockLevel?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
