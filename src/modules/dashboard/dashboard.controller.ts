// src/modules/dashboard/dashboard.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";
import { DashboardStatsDto, MemberDashboardDto, DailySummaryDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../auth/dto/register.dto";
import { Roles } from "src/common/roles.decorator";

@ApiTags("dashboard")
@ApiSecurity("JWT-auth")
@Controller("dashboard")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // ==================== ADMIN DASHBOARD ====================

  @Get("admin")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Get admin dashboard stats" })
  @ApiResponse({
    status: 200,
    description: "Admin dashboard stats",
    type: DashboardStatsDto,
  })
  async getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  // ==================== MEMBER DASHBOARD ====================

  @Get("member")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get member dashboard stats" })
  @ApiResponse({
    status: 200,
    description: "Member dashboard stats",
    type: MemberDashboardDto,
  })
  async getMemberDashboard(@Request() req) {
    return this.dashboardService.getMemberDashboard(req.user.id);
  }

  // ==================== DAILY SUMMARY ====================

  @Get("daily")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get daily summary" })
  @ApiQuery({ name: "date", required: false, example: "2026-08-08" })
  @ApiResponse({
    status: 200,
    description: "Daily summary",
    type: DailySummaryDto,
  })
  async getDailySummary(@Query("date") date?: string) {
    return this.dashboardService.getDailySummary(date);
  }

  // ==================== MONTHLY SUMMARY ====================

  @Get("monthly")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get monthly summary for dashboard" })
  @ApiQuery({ name: "year", required: false, example: 2026 })
  @ApiQuery({ name: "month", required: false, example: 8 })
  @ApiResponse({ status: 200, description: "Monthly summary" })
  async getMonthlySummary(
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    return this.dashboardService.getMonthlySummaryForDashboard(year, month);
  }
}
