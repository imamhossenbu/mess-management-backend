// src/modules/users/dto/user-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  profileImage?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  approvalStatus: string;

  @ApiProperty()
  joinedDate: Date;

  @ApiProperty()
  leftDate?: Date;

  @ApiProperty()
  balance?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
