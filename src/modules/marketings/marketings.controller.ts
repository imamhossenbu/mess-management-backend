// src/modules/marketings/marketings.controller.ts
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
import { MarketingsService } from "./marketings.service";
import {
  CreateMarketingDto,
  UpdateMarketingDto,
  MarketingResponseDto,
  DailyMarketingSummaryDto,
  MonthlyMarketingSummaryDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

import { Role } from "../auth/dto/register.dto";
import { Roles } from "src/common/roles.decorator";

@ApiTags("marketings")
@ApiSecurity("JWT-auth")
@Controller("marketings")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarketingsController {
  constructor(private readonly marketingsService: MarketingsService) {}

  // ==================== CREATE ====================

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Create a new marketing/bazar entry" })
  @ApiResponse({
    status: 201,
    description: "Marketing entry created successfully",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async create(@Body() createMarketingDto: CreateMarketingDto) {
    return this.marketingsService.create(createMarketingDto);
  }

  // ==================== FIND ====================

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get all marketing entries" })
  @ApiResponse({
    status: 200,
    description: "List of all marketing entries",
    type: [MarketingResponseDto],
  })
  async findAll() {
    return this.marketingsService.findAll();
  }

  @Get("daily")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get daily marketing summary" })
  @ApiQuery({ name: "date", required: false, example: "2026-08-08" })
  @ApiResponse({
    status: 200,
    description: "Daily marketing summary",
    type: DailyMarketingSummaryDto,
  })
  async getDailySummary(@Query("date") date?: string) {
    const queryDate = date ? new Date(date) : new Date();
    return this.marketingsService.getDailySummary(queryDate);
  }

  @Get("monthly")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get monthly marketing summary" })
  @ApiQuery({ name: "year", required: false, example: 2026 })
  @ApiQuery({ name: "month", required: false, example: 8 })
  @ApiResponse({
    status: 200,
    description: "Monthly marketing summary",
    type: MonthlyMarketingSummaryDto,
  })
  async getMonthlySummary(
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;
    return this.marketingsService.getMonthlySummary(queryYear, queryMonth);
  }

  @Get("user/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get marketing entries by user" })
  @ApiParam({ name: "userId", description: "User UUID" })
  @ApiResponse({
    status: 200,
    description: "User marketing entries",
    type: [MarketingResponseDto],
  })
  async findByUser(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.marketingsService.findByUser(userId, start, end);
  }

  @Get("date/:date")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get marketing entries by date" })
  @ApiParam({ name: "date", example: "2026-08-08" })
  @ApiResponse({
    status: 200,
    description: "Date marketing entries",
    type: [MarketingResponseDto],
  })
  async findByDate(@Param("date") date: string) {
    return this.marketingsService.findByDate(new Date(date));
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get a marketing entry by ID" })
  @ApiParam({ name: "id", description: "Marketing UUID" })
  @ApiResponse({
    status: 200,
    description: "Marketing entry found",
    type: MarketingResponseDto,
  })
  @ApiResponse({ status: 404, description: "Marketing entry not found" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.marketingsService.findOne(id);
  }

  // ==================== UPDATE ====================

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Update a marketing entry" })
  @ApiParam({ name: "id", description: "Marketing UUID" })
  @ApiResponse({
    status: 200,
    description: "Marketing entry updated successfully",
    type: MarketingResponseDto,
  })
  @ApiResponse({ status: 404, description: "Marketing entry not found" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateMarketingDto: UpdateMarketingDto,
  ) {
    return this.marketingsService.update(id, updateMarketingDto);
  }

  // ==================== DELETE ====================

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a marketing entry" })
  @ApiParam({ name: "id", description: "Marketing UUID" })
  @ApiResponse({
    status: 200,
    description: "Marketing entry deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Marketing entry not found" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.marketingsService.remove(id);
  }

  @Delete("date/:date")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete all marketing entries for a date" })
  @ApiParam({ name: "date", example: "2026-08-08" })
  async removeByDate(@Param("date") date: string) {
    return this.marketingsService.removeByDate(new Date(date));
  }
}
