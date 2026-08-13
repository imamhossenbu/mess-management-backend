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
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
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
import { Roles } from "../../common/roles.decorator";

@ApiTags("marketings")
@ApiBearerAuth("JWT-auth")
@Controller("marketings")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarketingsController {
  constructor(private readonly marketingsService: MarketingsService) {}

  @Post()
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Create a new marketing/bazar entry" })
  async create(@Request() req, @Body() createMarketingDto: CreateMarketingDto) {
    return this.marketingsService.create(req.user.id, createMarketingDto);
  }

  @Get()
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get all marketing entries" })
  async findAll() {
    return this.marketingsService.findAll();
  }

  @Get("daily")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get daily marketing summary" })
  async getDailySummary(@Query("date") date?: string) {
    const queryDate = date ? new Date(date) : new Date();
    return this.marketingsService.getDailySummary(queryDate);
  }

  @Get("monthly")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get monthly marketing summary" })
  async getMonthlySummary(
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;
    return this.marketingsService.getMonthlySummary(queryYear, queryMonth);
  }

  @Get("user/:userId")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get marketing entries by user" })
  async findByUser(
    @Param("userId") userId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.marketingsService.findByUser(userId, start, end);
  }

  @Get("date/:date")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get marketing entries by date" })
  async findByDate(@Param("date") date: string) {
    return this.marketingsService.findByDate(new Date(date));
  }

  @Get(":id")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get marketing entry by ID" })
  async findOne(@Param("id") id: string) {
    return this.marketingsService.findOne(id);
  }

  @Patch(":id")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Update marketing entry" })
  async update(
    @Param("id") id: string,
    @Body() updateMarketingDto: UpdateMarketingDto,
  ) {
    return this.marketingsService.update(id, updateMarketingDto);
  }

  @Delete(":id")
  @Roles("ADMIN", "MANAGER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete marketing entry" })
  async remove(@Param("id") id: string) {
    return this.marketingsService.remove(id);
  }
}
