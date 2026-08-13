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
  ApiParam,
  ApiConsumes,
  ApiBody,
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
import { Role } from "../auth/dto/register.dto";
import { CurrentMess } from "src/common/current-mess.decorator";

@ApiTags("users")
@ApiBearerAuth("JWT-auth")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch("manage/:id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch("profile")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post("profile/image")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  async uploadProfileImage(@Request() req, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException("No file provided");
    }
    return this.usersService.updateProfileImage(req.user.id, file);
  }

  @Delete("profile/image")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @HttpCode(HttpStatus.OK)
  async removeProfileImage(@Request() req) {
    return this.usersService.removeProfileImage(req.user.id);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  async remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Delete(":id/hard")
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async hardDelete(@Param("id") id: string) {
    return this.usersService.hardDelete(id);
  }
}
