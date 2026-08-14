// src/modules/marketings/dto/marketing-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { PaymentType, Unit } from "@prisma/client";

export class MarketingItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  itemName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit: Unit;

  @ApiProperty()
  price: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  note?: string;

  @ApiProperty()
  addedToInventory: boolean;

  @ApiProperty()
  inventoryItemId?: string;

  @ApiProperty()
  createdAt: Date;
}

export class MarketingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  shopName?: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  paymentType: PaymentType;

  @ApiProperty()
  note?: string;

  @ApiProperty()
  imageUrl?: string; // ✅ Added

  @ApiProperty({ type: [MarketingItemResponseDto] })
  items: MarketingItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class DailyMarketingSummaryDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  totalCash: number;

  @ApiProperty()
  totalDebt: number;

  @ApiProperty()
  totalSelf: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty({ type: [MarketingResponseDto] })
  items: MarketingResponseDto[];
}

export class MonthlyMarketingSummaryDto {
  @ApiProperty()
  month: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  totalCash: number;

  @ApiProperty()
  totalDebt: number;

  @ApiProperty()
  totalSelf: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty({ type: [Object] })
  categorySummary: {
    itemName: string;
    totalAmount: number;
    count: number;
  }[];

  @ApiProperty({ type: [MarketingResponseDto] })
  marketings?: MarketingResponseDto[]; // ✅ Added
}
