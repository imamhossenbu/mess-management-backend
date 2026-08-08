// src/modules/shop-debts/dto/shop-debt-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { DebtStatus } from "@prisma/client";

export class ShopDebtResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  shopName: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  itemDetails?: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: DebtStatus;

  @ApiProperty()
  paidDate?: Date;

  @ApiProperty()
  note?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ShopDebtSummaryDto {
  @ApiProperty()
  totalDue: number;

  @ApiProperty()
  totalPaid: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ type: [Object] })
  shopWiseSummary: {
    shopName: string;
    totalDue: number;
    totalPaid: number;
    totalAmount: number;
  }[];
}

export class MonthlyShopDebtSummaryDto {
  @ApiProperty()
  month: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  totalDebt: number;

  @ApiProperty()
  totalPaid: number;

  @ApiProperty()
  currentDue: number;

  @ApiProperty({ type: [ShopDebtResponseDto] })
  debts: ShopDebtResponseDto[];
}
