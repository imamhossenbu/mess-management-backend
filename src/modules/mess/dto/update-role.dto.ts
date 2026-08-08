// src/modules/mess/dto/update-role.dto.ts
import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateRoleDto {
  @ApiProperty({ enum: ["SUPER_ADMIN", "ADMIN", "MEMBER"] })
  @IsEnum(["SUPER_ADMIN", "ADMIN", "MEMBER"])
  role: string;
}
