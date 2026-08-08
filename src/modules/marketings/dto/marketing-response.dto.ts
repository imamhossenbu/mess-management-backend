// src/modules/marketings/dto/marketing-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { PaymentType } from "@prisma/client";

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
  itemName: string;

  @ApiProperty()
  quantity?: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paymentType: PaymentType;

  @ApiProperty()
  shopName?: string;

  @ApiProperty()
  note?: string;

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
}
