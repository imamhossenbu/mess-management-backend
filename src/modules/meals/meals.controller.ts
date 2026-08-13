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

@ApiTags("meals")
@ApiBearerAuth("JWT-auth")
@Controller("meals")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Create a single meal entry" })
  async create(@Body() createMealDto: CreateMealDto) {
    return this.mealsService.create(createMealDto);
  }

  @Post("bulk")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Bulk meal entry for multiple users" })
  async bulkEntry(@Body() bulkMealDto: BulkMealEntryDto) {
    return this.mealsService.bulkEntry(bulkMealDto);
  }

  @Post("single-meal-type")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Single meal type entry (morning/lunch/dinner)" })
  async singleMealEntry(@Body() singleMealDto: SingleMealEntryDto) {
    return this.mealsService.singleMealEntry(singleMealDto);
  }

  @Get()
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get all meals" })
  async findAll() {
    return this.mealsService.findAll();
  }

  @Get("daily")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get daily meal summary" })
  async getDailySummary(@Query("date") date?: string) {
    const queryDate = date ? new Date(date) : new Date();
    return this.mealsService.getDailySummary(queryDate);
  }

  @Get("monthly")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get monthly meal summary" })
  async getMonthlySummary(
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;
    return this.mealsService.getMonthlySummary(queryYear, queryMonth);
  }

  // ✅ NEW: Monthly Date-wise Meal View API
  @Get("monthly/date-wise")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get monthly date-wise meal view" })
  @ApiQuery({ name: "year", required: false, type: Number })
  @ApiQuery({ name: "month", required: false, type: Number })
  async getMonthlyDateWiseMeals(
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;
    return this.mealsService.getMonthlyDateWiseMeals(queryYear, queryMonth);
  }

  @Get("user/:userId")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get meals by user" })
  async findByUser(
    @Param("userId") userId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.mealsService.findByUser(userId, start, end);
  }

  @Get("date/:date")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get meals by date" })
  async findByDate(@Param("date") date: string) {
    return this.mealsService.findByDate(new Date(date));
  }

  @Get(":id")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get meal by ID" })
  async findOne(@Param("id") id: string) {
    return this.mealsService.findOne(id);
  }

  @Patch(":id")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Update meal entry" })
  async update(@Param("id") id: string, @Body() updateMealDto: UpdateMealDto) {
    return this.mealsService.update(id, updateMealDto);
  }

  @Delete(":id")
  @Roles("ADMIN", "MANAGER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete meal entry" })
  async remove(@Param("id") id: string) {
    return this.mealsService.remove(id);
  }

  @Delete("date/:date")
  @Roles("ADMIN", "MANAGER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete all meals for a date" })
  async removeByDate(@Param("date") date: string) {
    return this.mealsService.removeByDate(new Date(date));
  }
}
