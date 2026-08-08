// src/modules/utility-bills/utility-bills.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { UtilityBillsService } from "./utility-bills.service";
import {
  CreateUtilityBillDto,
  UpdateUtilityBillDto,
  UtilityBillResponseDto,
  MonthlyUtilitySummaryDto,
  UtilityBillSummaryDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../auth/dto/register.dto";
import { Roles } from "src/common/roles.decorator";

@ApiTags("utility-bills")
@ApiSecurity("JWT-auth")
@Controller("utility-bills")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UtilityBillsController {
  constructor(private readonly utilityBillsService: UtilityBillsService) {}

  // ==================== CREATE ====================

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Create a new utility bill" })
  @ApiResponse({
    status: 201,
    description: "Utility bill created successfully",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 400,
    description: "Bill already exists for this month",
  })
  async create(@Body() createUtilityBillDto: CreateUtilityBillDto) {
    return this.utilityBillsService.create(createUtilityBillDto);
  }

  // ==================== FIND ====================

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get all utility bills" })
  @ApiResponse({
    status: 200,
    description: "List of all utility bills",
    type: [UtilityBillResponseDto],
  })
  async findAll() {
    return this.utilityBillsService.findAll();
  }

  @Get("summary")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get utility bills summary" })
  @ApiResponse({
    status: 200,
    description: "Utility bills summary",
    type: UtilityBillSummaryDto,
  })
  async getSummary() {
    return this.utilityBillsService.getSummary();
  }

  @Get("monthly")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get monthly utility bills summary" })
  @ApiQuery({ name: "year", required: false, example: 2026 })
  @ApiQuery({ name: "month", required: false, example: 8 })
  @ApiResponse({
    status: 200,
    description: "Monthly utility bills summary",
    type: MonthlyUtilitySummaryDto,
  })
  async getMonthlySummary(
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;
    return this.utilityBillsService.getMonthlySummary(queryYear, queryMonth);
  }

  @Get("month/:year/:month")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get all utility bills for a specific month" })
  @ApiParam({ name: "year", example: 2026 })
  @ApiParam({ name: "month", example: 8 })
  @ApiResponse({
    status: 200,
    description: "Monthly utility bills",
    type: [UtilityBillResponseDto],
  })
  async findByMonth(
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.utilityBillsService.findByMonth(year, month);
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get a utility bill by ID" })
  @ApiParam({ name: "id", description: "Utility bill UUID" })
  @ApiResponse({
    status: 200,
    description: "Utility bill found",
    type: UtilityBillResponseDto,
  })
  @ApiResponse({ status: 404, description: "Utility bill not found" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.utilityBillsService.findOne(id);
  }

  // ==================== UPDATE ====================

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Update a utility bill" })
  @ApiParam({ name: "id", description: "Utility bill UUID" })
  @ApiResponse({
    status: 200,
    description: "Utility bill updated successfully",
    type: UtilityBillResponseDto,
  })
  @ApiResponse({ status: 404, description: "Utility bill not found" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateUtilityBillDto: UpdateUtilityBillDto,
  ) {
    return this.utilityBillsService.update(id, updateUtilityBillDto);
  }

  // ==================== DELETE ====================

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a utility bill" })
  @ApiParam({ name: "id", description: "Utility bill UUID" })
  @ApiResponse({
    status: 200,
    description: "Utility bill deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Utility bill not found" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.utilityBillsService.remove(id);
  }

  @Delete("month/:year/:month")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete all utility bills for a month" })
  @ApiParam({ name: "year", example: 2026 })
  @ApiParam({ name: "month", example: 8 })
  async removeByMonth(
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.utilityBillsService.removeByMonth(year, month);
  }
}
