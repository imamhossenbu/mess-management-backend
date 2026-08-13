// src/modules/mess/dto/update-role.dto.ts
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateRoleDto {
  @ApiProperty({ enum: ["SUPER_ADMIN", "ADMIN", "MEMBER"] })
  @IsEnum(["SUPER_ADMIN", "ADMIN", "MEMBER"])
  role: string;

  @ApiProperty({ enum: ["SUPER_ADMIN", "ADMIN", "MEMBER"], isArray: true, required: false })
  @IsArray()
  @IsEnum(["SUPER_ADMIN", "ADMIN", "MEMBER"], { each: true })
  @IsOptional()
  roles?: string[];
}
