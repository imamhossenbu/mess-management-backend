// src/modules/utility-bills/dto/utility-bill-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { BillType } from "@prisma/client";

export class UtilityBillResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  billType: BillType;

  @ApiProperty()
  monthYear: Date;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paidBy?: string;

  @ApiProperty()
  paidByName?: string;

  @ApiProperty()
  note?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class MonthlyUtilitySummaryDto {
  @ApiProperty()
  month: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  totalCurrent: number;

  @ApiProperty()
  totalWifi: number;

  @ApiProperty()
  totalRent: number;

  @ApiProperty()
  totalWater: number;

  @ApiProperty()
  totalKhala: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  perPersonShare: number;

  @ApiProperty()
  totalMembers: number;

  @ApiProperty({ type: [UtilityBillResponseDto] })
  bills: UtilityBillResponseDto[];
}

export class UtilityBillSummaryDto {
  @ApiProperty()
  totalCurrent: number;

  @ApiProperty()
  totalWifi: number;

  @ApiProperty()
  totalRent: number;

  @ApiProperty()
  totalWater: number;

  @ApiProperty()
  totalKhala: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  perPersonShare: number;

  @ApiProperty()
  totalMembers: number;
}
