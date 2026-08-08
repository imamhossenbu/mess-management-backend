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
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";
import { DashboardStatsDto, MemberDashboardDto, DailySummaryDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";
import { Role } from "../auth/dto/register.dto";
import { CurrentMess } from "../../common/current-mess.decorator";

@ApiTags("dashboard")
@ApiBearerAuth("JWT-auth")
@Controller("dashboard")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("admin")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async getAdminDashboard(@CurrentMess() messId: string) {
    return this.dashboardService.getAdminDashboard(messId);
  }

  @Get("member")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getMemberDashboard(@Request() req) {
    return this.dashboardService.getMemberDashboard(req.user.id);
  }

  @Get("daily")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getDailySummary(
    @CurrentMess() messId: string,
    @Query("date") date?: string,
  ) {
    return this.dashboardService.getDailySummary(messId, date);
  }

  @Get("monthly")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getMonthlySummary(
    @CurrentMess() messId: string,
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    return this.dashboardService.getMonthlySummaryForDashboard(
      messId,
      year,
      month,
    );
  }
}
