// src/modules/inventory/dto/update-inventory.dto.ts
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsUUID,
  IsDecimal,
  IsNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { InventoryCategory, Unit } from "@prisma/client";

export class CreateInventoryItemDto {
  @ApiProperty({ example: "Rui Fish" })
  @IsString()
  name: string;

  @ApiProperty({ enum: InventoryCategory, example: "FISH" })
  @IsEnum(InventoryCategory)
  category: InventoryCategory;

  @ApiProperty({ enum: Unit, example: "KG" })
  @IsEnum(Unit)
  unit: Unit;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(0)
  minStockLevel: number;

  @ApiProperty({ example: 350, required: false })
  @IsNumber()
  @IsOptional()
  purchasePrice?: number;

  @ApiProperty({ example: 400, required: false })
  @IsNumber()
  @IsOptional()
  sellingPrice?: number;
}

export class AddInventoryDto {
  @ApiProperty({ example: "Rui Fish" })
  @IsString()
  itemName: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ enum: Unit, example: "KG" })
  @IsEnum(Unit)
  unit: Unit;

  @ApiProperty({
    example: "marketing-item-id-123",
    description: "কোন বাজার থেকে যোগ করছেন (Marketing Item ID)",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  marketingItemId?: string;

  @ApiProperty({ example: "বাজার থেকে কেনা হয়েছে", required: false })
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

  @ApiProperty({ example: "রান্নায় ব্যবহার করা হয়েছে", required: false })
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

  @ApiProperty({ example: "স্টক চেক করে আপডেট করা হয়েছে", required: false })
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

  @ApiProperty({ enum: Unit, required: false })
  @IsEnum(Unit)
  @IsOptional()
  unit?: Unit;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  minStockLevel?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  purchasePrice?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  sellingPrice?: number;
}
