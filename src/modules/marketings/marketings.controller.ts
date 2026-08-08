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
import { Role } from "../auth/dto/register.dto";
import { CurrentMess } from "../../common/current-mess.decorator";

@ApiTags("marketings")
@ApiBearerAuth("JWT-auth")
@Controller("marketings")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarketingsController {
  constructor(private readonly marketingsService: MarketingsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async create(
    @CurrentMess() messId: string,
    @Body() createMarketingDto: CreateMarketingDto,
  ) {
    return this.marketingsService.create(messId, createMarketingDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findAll(@CurrentMess() messId: string) {
    return this.marketingsService.findAll(messId);
  }

  @Get("daily")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getDailySummary(
    @CurrentMess() messId: string,
    @Query("date") date?: string,
  ) {
    const queryDate = date ? new Date(date) : new Date();
    return this.marketingsService.getDailySummary(messId, queryDate);
  }

  @Get("monthly")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getMonthlySummary(
    @CurrentMess() messId: string,
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;
    return this.marketingsService.getMonthlySummary(
      messId,
      queryYear,
      queryMonth,
    );
  }

  @Get("user/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findByUser(
    @CurrentMess() messId: string,
    @Param("userId", ParseUUIDPipe) userId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.marketingsService.findByUser(messId, userId, start, end);
  }

  @Get("date/:date")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findByDate(@CurrentMess() messId: string, @Param("date") date: string) {
    return this.marketingsService.findByDate(messId, new Date(date));
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findOne(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.marketingsService.findOne(messId, id);
  }

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async update(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateMarketingDto: UpdateMarketingDto,
  ) {
    return this.marketingsService.update(messId, id, updateMarketingDto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.marketingsService.remove(messId, id);
  }

  @Delete("date/:date")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  async removeByDate(
    @CurrentMess() messId: string,
    @Param("date") date: string,
  ) {
    return this.marketingsService.removeByDate(messId, new Date(date));
  }
}
