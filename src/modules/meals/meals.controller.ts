// src/modules/meals/meals.controller.ts
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
import { MealsService } from "./meals.service";
import {
  CreateMealDto,
  BulkMealEntryDto,
  SingleMealEntryDto,
  UpdateMealDto,
  MealResponseDto,
  DailyMealSummaryDto,
  MonthlyMealSummaryDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";
import { Role } from "../auth/dto/register.dto";
import { CurrentMess } from "../../common/current-mess.decorator";

@ApiTags("meals")
@ApiBearerAuth("JWT-auth")
@Controller("meals")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async create(
    @CurrentMess() messId: string,
    @Body() createMealDto: CreateMealDto,
  ) {
    return this.mealsService.create(messId, createMealDto);
  }

  @Post("bulk")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async bulkEntry(
    @CurrentMess() messId: string,
    @Body() bulkMealDto: BulkMealEntryDto,
  ) {
    return this.mealsService.bulkEntry(messId, bulkMealDto);
  }

  @Post("single-meal-type")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async singleMealEntry(
    @CurrentMess() messId: string,
    @Body() singleMealDto: SingleMealEntryDto,
  ) {
    return this.mealsService.singleMealEntry(messId, singleMealDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findAll(@CurrentMess() messId: string) {
    return this.mealsService.findAll(messId);
  }

  @Get("daily")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getDailySummary(
    @CurrentMess() messId: string,
    @Query("date") date?: string,
  ) {
    const queryDate = date ? new Date(date) : new Date();
    return this.mealsService.getDailySummary(messId, queryDate);
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
    return this.mealsService.getMonthlySummary(messId, queryYear, queryMonth);
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
    return this.mealsService.findByUser(messId, userId, start, end);
  }

  @Get("date/:date")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findByDate(@CurrentMess() messId: string, @Param("date") date: string) {
    return this.mealsService.findByDate(messId, new Date(date));
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findOne(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.mealsService.findOne(messId, id);
  }

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async update(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateMealDto: UpdateMealDto,
  ) {
    return this.mealsService.update(messId, id, updateMealDto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.mealsService.remove(messId, id);
  }

  @Delete("date/:date")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  async removeByDate(
    @CurrentMess() messId: string,
    @Param("date") date: string,
  ) {
    return this.mealsService.removeByDate(messId, new Date(date));
  }
}
