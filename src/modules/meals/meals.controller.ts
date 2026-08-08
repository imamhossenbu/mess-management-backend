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
import { Role } from "../auth/dto/register.dto";
import { Roles } from "../../common/roles.decorator";

@ApiTags("meals")
@ApiBearerAuth("JWT-auth")
@Controller("meals")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  // ==================== CREATE ====================

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Create a single meal entry (Admin/Manager only)" })
  @ApiResponse({
    status: 201,
    description: "Meal created successfully",
    type: MealResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: "Meal already exists for this date",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async create(@Body() createMealDto: CreateMealDto) {
    return this.mealsService.create(createMealDto);
  }

  @Post("bulk")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Bulk meal entry for a date (Admin/Manager only)" })
  @ApiResponse({ status: 201, description: "Bulk meals created successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async bulkEntry(@Body() bulkMealDto: BulkMealEntryDto) {
    return this.mealsService.bulkEntry(bulkMealDto);
  }

  @Post("single-meal-type")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: "Entry for a single meal type (morning/lunch/dinner)",
  })
  @ApiResponse({ status: 201, description: "Meals updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async singleMealEntry(@Body() singleMealDto: SingleMealEntryDto) {
    return this.mealsService.singleMealEntry(singleMealDto);
  }

  // ==================== FIND ====================

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get all meals" })
  @ApiResponse({
    status: 200,
    description: "List of all meals",
    type: [MealResponseDto],
  })
  async findAll() {
    return this.mealsService.findAll();
  }

  @Get("daily")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get daily meal summary" })
  @ApiQuery({ name: "date", required: false, example: "2026-08-08" })
  @ApiResponse({
    status: 200,
    description: "Daily meal summary",
    type: DailyMealSummaryDto,
  })
  async getDailySummary(@Query("date") date?: string) {
    const queryDate = date ? new Date(date) : new Date();
    return this.mealsService.getDailySummary(queryDate);
  }

  @Get("monthly")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get monthly meal summary" })
  @ApiQuery({ name: "year", required: false, example: 2026 })
  @ApiQuery({ name: "month", required: false, example: 8 })
  @ApiResponse({
    status: 200,
    description: "Monthly meal summary",
    type: MonthlyMealSummaryDto,
  })
  async getMonthlySummary(
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;
    return this.mealsService.getMonthlySummary(queryYear, queryMonth);
  }

  @Get("user/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get meals by user ID" })
  @ApiParam({ name: "userId", description: "User UUID" })
  @ApiResponse({
    status: 200,
    description: "User meals",
    type: [MealResponseDto],
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async findByUser(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.mealsService.findByUser(userId, start, end);
  }

  @Get("date/:date")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get meals by date" })
  @ApiParam({ name: "date", example: "2026-08-08" })
  @ApiResponse({
    status: 200,
    description: "Date meals",
    type: [MealResponseDto],
  })
  async findByDate(@Param("date") date: string) {
    return this.mealsService.findByDate(new Date(date));
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get a meal by ID" })
  @ApiParam({ name: "id", description: "Meal UUID" })
  @ApiResponse({
    status: 200,
    description: "Meal found",
    type: MealResponseDto,
  })
  @ApiResponse({ status: 404, description: "Meal not found" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.mealsService.findOne(id);
  }

  // ==================== UPDATE ====================

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Update a meal (Admin/Manager only)" })
  @ApiParam({ name: "id", description: "Meal UUID" })
  @ApiResponse({
    status: 200,
    description: "Meal updated successfully",
    type: MealResponseDto,
  })
  @ApiResponse({ status: 404, description: "Meal not found" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateMealDto: UpdateMealDto,
  ) {
    return this.mealsService.update(id, updateMealDto);
  }

  // ==================== DELETE ====================

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a meal (Admin/Manager only)" })
  @ApiParam({ name: "id", description: "Meal UUID" })
  @ApiResponse({ status: 200, description: "Meal deleted successfully" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.mealsService.remove(id);
  }

  @Delete("date/:date")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete all meals for a date (Admin/Manager only)" })
  @ApiParam({ name: "date", example: "2026-08-08" })
  async removeByDate(@Param("date") date: string) {
    return this.mealsService.removeByDate(new Date(date));
  }
}
