// src/modules/mess/mess.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { MessService } from "./mess.service";
import {
  CreateMessDto,
  UpdateMessDto,
  AddMemberDto,
  UpdateRoleDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";
import { Role } from "../auth/dto/register.dto";

@ApiTags("mess")
@ApiBearerAuth("JWT-auth")
@Controller("mess")
@UseGuards(JwtAuthGuard, RolesGuard) // ✅ JWT + Roles Guard
export class MessController {
  constructor(private readonly messService: MessService) {}

  // ✅ Create - Any logged in user (SUPER_ADMIN, MANAGER, MEMBER)
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER) // ✅ All roles
  @ApiOperation({ summary: "Create a new mess" })
  async create(@Request() req, @Body() createMessDto: CreateMessDto) {
    throw new ForbiddenException("Creation of mess is disabled.");
  }

  // ✅ Get User Messes - Any logged in user
  @Get("user/messes")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get all messes for the current user" })
  async getUserMesses(@Request() req) {
    return this.messService.getUserMesses(req.user.id);
  }

  // ✅ Get Mess Details - Any logged in user (must be member)
  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get mess details" })
  @ApiParam({ name: "id", description: "Mess ID" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.messService.findOne(id);
  }

  // ✅ Update Mess - Only SUPER_ADMIN
  @Patch(":id")
  @Roles(Role.SUPER_ADMIN) // ✅ Only SUPER_ADMIN
  @ApiOperation({ summary: "Update mess details" })
  @ApiParam({ name: "id", description: "Mess ID" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateMessDto: UpdateMessDto,
  ) {
    return this.messService.update(id, updateMessDto);
  }

  // ✅ Delete Mess - Only SUPER_ADMIN
  @Delete(":id")
  @Roles(Role.SUPER_ADMIN) // ✅ Only SUPER_ADMIN
  @ApiOperation({ summary: "Delete a mess" })
  @ApiParam({ name: "id", description: "Mess ID" })
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    throw new ForbiddenException("Deletion of mess is disabled.");
  }

  // ✅ Get Members - Any logged in user (must be member)
  @Get(":id/members")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get all members of a mess" })
  @ApiParam({ name: "id", description: "Mess ID" })
  async getMembers(@Param("id", ParseUUIDPipe) id: string) {
    return this.messService.getMembers(id);
  }

  // ✅ Add Member - Only SUPER_ADMIN
  @Post(":id/members")
  @Roles(Role.SUPER_ADMIN) // ✅ Only SUPER_ADMIN
  @ApiOperation({ summary: "Add a member to the mess" })
  @ApiParam({ name: "id", description: "Mess ID" })
  async addMember(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.messService.addMember(
      id,
      addMemberDto.userId,
      addMemberDto.role,
    );
  }

  // ✅ Remove Member - Only SUPER_ADMIN
  @Delete(":id/members/:userId")
  @Roles(Role.SUPER_ADMIN) // ✅ Only SUPER_ADMIN
  @ApiOperation({ summary: "Remove a member from the mess" })
  @ApiParam({ name: "id", description: "Mess ID" })
  @ApiParam({ name: "userId", description: "User ID" })
  @HttpCode(HttpStatus.OK)
  async removeMember(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("userId", ParseUUIDPipe) userId: string,
  ) {
    return this.messService.removeMember(id, userId);
  }

  // ✅ Update Member Role - Only SUPER_ADMIN
  @Patch(":id/members/:userId/role")
  @Roles(Role.SUPER_ADMIN) // ✅ Only SUPER_ADMIN
  @ApiOperation({ summary: "Update member role" })
  @ApiParam({ name: "id", description: "Mess ID" })
  @ApiParam({ name: "userId", description: "User ID" })
  async updateMemberRole(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.messService.updateMemberRole(id, userId, updateRoleDto.role);
  }
}
