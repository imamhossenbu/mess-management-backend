// src/modules/monthly-summary/monthly-summary.controller.ts
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
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { MonthlySummaryService } from "./monthly-summary.service";
import {
  MonthlySummaryResponseDto,
  GenerateMonthlySummaryDto,
  UpdateMonthlySummaryDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";

@ApiTags("monthly-summary")
@ApiBearerAuth("JWT-auth")
@Controller("monthly-summary")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MonthlySummaryController {
  constructor(private readonly monthlySummaryService: MonthlySummaryService) {}

  @Post("generate")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Generate monthly summary" })
  async generate(@Body() generateDto: GenerateMonthlySummaryDto) {
    return this.monthlySummaryService.generateMonthlySummary(
      generateDto.year,
      generateDto.month,
      generateDto.adjustmentFromPrevious,
      generateDto.adjustmentToNext,
    );
  }

  @Get()
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get all monthly summaries" })
  async findAll() {
    return this.monthlySummaryService.getAllMonthlySummaries();
  }

  @Get("month")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get monthly summary for specific month" })
  async getMonthlySummary(
    @Query("year", ParseIntPipe) year: number,
    @Query("month", ParseIntPipe) month: number,
  ) {
    return this.monthlySummaryService.getMonthlySummary(year, month);
  }

  @Get("user/:userId")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get user monthly summaries" })
  async getUserSummaries(
    @Param("userId") userId: string,
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    return this.monthlySummaryService.getUserMonthlySummaries(
      userId,
      year,
      month,
    );
  }

  @Patch(":id")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Update monthly summary" })
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateMonthlySummaryDto,
  ) {
    return this.monthlySummaryService.updateMonthlySummary(id, updateDto);
  }

  @Delete("month/:year/:month")
  @Roles("ADMIN", "MANAGER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete monthly summary" })
  async deleteMonthlySummary(
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.monthlySummaryService.deleteMonthlySummary(year, month);
  }
}
