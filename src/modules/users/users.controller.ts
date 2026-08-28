// src/modules/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  UpdateProfileDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";

@ApiTags("users")
@ApiBearerAuth("JWT-auth")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Create a new user" })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles("ADMIN", "MANAGER", "MEMBER")

  @ApiOperation({ summary: "Get all users" })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Get user by ID" })
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch("manage/:id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Update user (Admin only)" })
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch("profile")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Update own profile" })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post("profile/image")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Upload profile image" })
  async uploadProfileImage(@Request() req, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException("No file provided");
    }
    return this.usersService.updateProfileImage(req.user.id, file);
  }

  @Delete("profile/image")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Remove profile image" })
  async removeProfileImage(@Request() req) {
    return this.usersService.removeProfileImage(req.user.id);
  }

  @Delete(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Deactivate user" })
  async remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Delete(":id/hard")
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Permanently delete user" })
  async hardDelete(@Param("id") id: string) {
    return this.usersService.hardDelete(id);
  }
}
