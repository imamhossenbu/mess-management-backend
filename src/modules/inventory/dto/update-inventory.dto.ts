// src/modules/inventory/dto/update-inventory.dto.ts
import { IsEnum, IsInt, IsOptional, IsString, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InventoryType } from '@prisma/client';

export class AddInventoryDto {
  @ApiProperty({ enum: InventoryType, example: 'MEAT' })
  @IsEnum(InventoryType)
  type: InventoryType;

  @ApiProperty({ example: 25, description: 'কত পিস যোগ করবেন' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ 
    example: 'marketing-id-123', 
    description: 'কোন বাজার থেকে যোগ করছেন (Marketing ID)',
    required: false 
  })
  @IsUUID()
  @IsOptional()
  marketingId?: string;

  @ApiProperty({ example: 'বাজার থেকে ২৫ পিস মুরগি কেনা হয়েছে', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class RemoveInventoryDto {
  @ApiProperty({ enum: InventoryType, example: 'MEAT' })
  @IsEnum(InventoryType)
  type: InventoryType;

  @ApiProperty({ example: 10, description: 'কত পিস বিয়োগ করবেন' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'রান্নায় ১০ পিস ব্যবহার করা হয়েছে', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class SetInventoryDto {
  @ApiProperty({ enum: InventoryType, example: 'MEAT' })
  @IsEnum(InventoryType)
  type: InventoryType;

  @ApiProperty({ example: 15, description: 'মোট কত পিস আছে' })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: 'স্টক চেক করে আপডেট করা হয়েছে', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}