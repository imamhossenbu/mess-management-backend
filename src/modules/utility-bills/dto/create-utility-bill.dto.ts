// src/modules/utility-bills/dto/create-utility-bill.dto.ts
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// ✅ Define BillType locally since it's not exported from @prisma/client
export enum BillType {
  CURRENT = "CURRENT",
  WIFI = "WIFI",
  RENT = "RENT",
  WATER = "WATER",
  KHALA = "KHALA",
}

export class CreateUtilityBillDto {
  @ApiProperty({ enum: BillType, example: "CURRENT" })
  @IsEnum(BillType)
  billType: BillType;

  @ApiProperty({ example: "2026-08-01", description: "বিলের মাস (১লা তারিখ)" })
  @IsDateString()
  monthYear: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: "user-id-123",
    required: false,
    description: "কে জমা দিয়েছে",
  })
  @IsUUID()
  @IsOptional()
  paidBy?: string;

  @ApiProperty({ example: "এই মাসের বিল বেশি হয়েছে", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
