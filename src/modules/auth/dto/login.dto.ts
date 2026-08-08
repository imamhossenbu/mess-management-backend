// src/modules/auth/dto/login.dto.ts
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "01712345678" })
  @IsString()
  phone: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  password: string;
}
