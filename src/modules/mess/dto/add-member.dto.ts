// src/modules/mess/dto/add-member.dto.ts
import { IsUUID, IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddMemberDto {
  @ApiProperty({ example: "user-id-123" })
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: ["SUPER_ADMIN", "ADMIN", "MEMBER"], default: "MEMBER" })
  @IsEnum(["SUPER_ADMIN", "ADMIN", "MEMBER"])
  @IsOptional()
  role?: string;
}
