// src/modules/auth/dto/auth-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    role: string;
    roomNumber?: string;
    profileImage?: string;
  };
}
