// src/modules/dashboard/dashboard.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";

@ApiTags("dashboard")
@ApiBearerAuth("JWT-auth")
@Controller("dashboard")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("admin")
  @Roles("ADMIN", "MANAGER")
  async getAdminDashboard(@Request() req) {
    return this.dashboardService.getAdminDashboard(req.user.id);
  }

  @Get("member")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  async getMemberDashboard(@Request() req) {
    return this.dashboardService.getMemberDashboard(req.user.id);
  }

  @Get("daily")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  async getDailySummary(@Query("date") date?: string) {
    return this.dashboardService.getDailySummary(date);
  }

  @Get("monthly")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  async getMonthlySummary(
    @Query("year") year?: string,
    @Query("month") month?: string,
  ) {
    let yearNum: number | undefined;
    let monthNum: number | undefined;

    if (year) {
      yearNum = parseInt(year);
      if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
        throw new BadRequestException(
          "Invalid year. Year must be between 2000 and 2100",
        );
      }
    }

    if (month) {
      monthNum = parseInt(month);
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        throw new BadRequestException(
          "Invalid month. Month must be between 1 and 12",
        );
      }
    }

    return this.dashboardService.getMonthlySummaryForDashboard(
      yearNum,
      monthNum,
    );
  }

  @Get("activities")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  async getActivities(
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 10;
    const offsetNum = offset ? parseInt(offset) : 0;
    return this.dashboardService.getActivities(limitNum, offsetNum);
  }

  @Get("meal-rate-history")
  @Roles("ADMIN", "MANAGER")
  async getMealRateHistory(@Query("days") days?: string) {
    const daysNum = days ? parseInt(days) : 30;
    return this.dashboardService.getMealRateHistory(daysNum);
  }

  @Get("member-balances")
  @Roles("ADMIN", "MANAGER")
  async getMemberBalances() {
    return this.dashboardService.getMemberBalances();
  }

  @Get("mess-stats")
  @Roles("ADMIN", "MANAGER")
  async getMessStats() {
    return this.dashboardService.getMessStats();
  }

  @Get("weekly-summary")
  @Roles("ADMIN", "MANAGER")
  async getWeeklySummary() {
    return this.dashboardService.getWeeklySummary();
  }
}
