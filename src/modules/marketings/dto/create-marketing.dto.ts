// src/modules/marketings/dto/create-marketing.dto.ts
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentType } from "@prisma/client";

export class CreateMarketingDto {
  @ApiProperty({ example: "2026-08-08", required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: "মুরগি" })
  @IsString()
  itemName: string;

  @ApiProperty({ example: "2 kg", required: false })
  @IsString()
  @IsOptional()
  quantity?: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ enum: PaymentType, default: PaymentType.CASH })
  @IsEnum(PaymentType)
  @IsOptional()
  paymentType?: PaymentType;

  @ApiProperty({ example: "MR Traders", required: false })
  @IsString()
  @IsOptional()
  shopName?: string;

  // ============ ইনভেন্টরি ফিল্ড ============
  @ApiProperty({
    enum: ["MEAT", "FISH"],
    required: false,
    description: "ইনভেন্টরি টাইপ (মাংস বা মাছ)",
  })
  @IsEnum(["MEAT", "FISH"])
  @IsOptional()
  inventoryType?: "MEAT" | "FISH";

  @ApiProperty({
    example: 25,
    required: false,
    description: "মোট কত পিস পেলেন (ইনভেন্টরিতে যোগ হবে)",
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalPieces?: number;

  @ApiProperty({
    example: 10,
    required: false,
    description: "আজকে রান্নায় কত পিস ব্যবহার করলেন (ইনভেন্টরি থেকে বিয়োগ হবে)",
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  usedPieces?: number;

  @ApiProperty({ example: "আজকে ২৫ পিস মুরগি পেয়েছি", required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
