// src/modules/inventory/dto/inventory-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { InventoryCategory } from "@prisma/client";

export class InventoryItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: InventoryCategory })
  category: InventoryCategory;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  minStockLevel: number;

  @ApiProperty()
  lastUpdated: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class InventoryLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  inventoryItemId: string;

  @ApiProperty()
  change: number;

  @ApiProperty()
  previousQuantity: number;

  @ApiProperty()
  newQuantity: number;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  note?: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  inventoryItem?: {
    id: string;
    name: string;
    category: InventoryCategory;
  };
}

export class InventorySummaryDto {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  lowStockItems: number;

  @ApiProperty()
  categories: Record<
    string,
    {
      items: InventoryItemResponseDto[];
      totalItems: number;
      lowStockItems: number;
    }
  >;
}
