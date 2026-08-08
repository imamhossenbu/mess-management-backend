// src/modules/monthly-summary/monthly-summary.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
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
import { MonthlySummaryService } from "./monthly-summary.service";
import { MonthlySummaryResponseDto, GenerateMonthlySummaryDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../auth/dto/register.dto";
import { Roles } from "src/common/roles.decorator";

@ApiTags("monthly-summary")
@ApiSecurity("JWT-auth")
@Controller("monthly-summary")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MonthlySummaryController {
  constructor(private readonly monthlySummaryService: MonthlySummaryService) {}

  // ==================== GENERATE ====================

  @Post("generate")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Generate monthly summary for a specific month" })
  @ApiResponse({
    status: 201,
    description: "Monthly summary generated successfully",
  })
  @ApiResponse({ status: 400, description: "No active users found" })
  async generate(@Body() generateDto: GenerateMonthlySummaryDto) {
    return this.monthlySummaryService.generateMonthlySummary(
      generateDto.year,
      generateDto.month,
    );
  }

  // ==================== GET ====================

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get all monthly summaries" })
  @ApiResponse({ status: 200, description: "List of all monthly summaries" })
  async findAll() {
    return this.monthlySummaryService.getAllMonthlySummaries();
  }

  @Get("month")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get monthly summary for a specific month" })
  @ApiQuery({ name: "year", required: true, example: 2026 })
  @ApiQuery({ name: "month", required: true, example: 8 })
  @ApiResponse({
    status: 200,
    description: "Monthly summary found",
    type: MonthlySummaryResponseDto,
  })
  @ApiResponse({ status: 404, description: "No summary found for this month" })
  async getMonthlySummary(
    @Query("year", ParseIntPipe) year: number,
    @Query("month", ParseIntPipe) month: number,
  ) {
    return this.monthlySummaryService.getMonthlySummary(year, month);
  }

  @Get("user/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get user monthly summaries" })
  @ApiParam({ name: "userId", description: "User UUID" })
  @ApiQuery({ name: "year", required: false, example: 2026 })
  @ApiQuery({ name: "month", required: false, example: 8 })
  @ApiResponse({ status: 200, description: "User monthly summaries found" })
  @ApiResponse({ status: 404, description: "No summaries found for this user" })
  async getUserSummaries(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    return this.monthlySummaryService.getUserMonthlySummaries(
      userId,
      year,
      month,
    );
  }

  // ==================== DELETE ====================

  @Delete("month/:year/:month")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete monthly summary for a specific month" })
  @ApiParam({ name: "year", example: 2026 })
  @ApiParam({ name: "month", example: 8 })
  @ApiResponse({
    status: 200,
    description: "Monthly summary deleted successfully",
  })
  @ApiResponse({ status: 404, description: "No summary found for this month" })
  async deleteMonthlySummary(
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.monthlySummaryService.deleteMonthlySummary(year, month);
  }
}
