// src/modules/inventory/dto/inventory-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { InventoryType } from '@prisma/client';

export class InventoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: InventoryType;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  lastUpdated: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class InventoryLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  inventoryId: string;

  @ApiProperty()
  change: number;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  marketingId?: string;

  @ApiProperty()
  note?: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  marketing?: {
    id: string;
    itemName: string;
    quantity: string;
    amount: number;
    shopName: string;
    date: Date;
  };
}

export class InventorySummaryDto {
  @ApiProperty()
  meat: {
    available: number;
    unit: string;
    lastUpdated: Date;
    logs?: InventoryLogResponseDto[];
  };

  @ApiProperty()
  fish: {
    available: number;
    unit: string;
    lastUpdated: Date;
    logs?: InventoryLogResponseDto[];
  };
}