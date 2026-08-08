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
import { MonthlySummaryService } from "./monthly-summary.service";
import {
  MonthlySummaryResponseDto,
  GenerateMonthlySummaryDto,
  UpdateMonthlySummaryDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";
import { Role } from "../auth/dto/register.dto";
import { CurrentMess } from "../../common/current-mess.decorator";

@ApiTags("monthly-summary")
@ApiBearerAuth("JWT-auth")
@Controller("monthly-summary")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MonthlySummaryController {
  constructor(private readonly monthlySummaryService: MonthlySummaryService) {}

  @Post("generate")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async generate(
    @CurrentMess() messId: string,
    @Body() generateDto: GenerateMonthlySummaryDto,
  ) {
    return this.monthlySummaryService.generateMonthlySummary(
      messId,
      generateDto.year,
      generateDto.month,
    );
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findAll(@CurrentMess() messId: string) {
    return this.monthlySummaryService.getAllMonthlySummaries(messId);
  }

  @Get("month")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getMonthlySummary(
    @CurrentMess() messId: string,
    @Query("year", ParseIntPipe) year: number,
    @Query("month", ParseIntPipe) month: number,
  ) {
    return this.monthlySummaryService.getMonthlySummary(messId, year, month);
  }

  @Get("user/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getUserSummaries(
    @CurrentMess() messId: string,
    @Param("userId", ParseUUIDPipe) userId: string,
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    return this.monthlySummaryService.getUserMonthlySummaries(
      messId,
      userId,
      year,
      month,
    );
  }

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async update(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateMonthlySummaryDto,
  ) {
    return this.monthlySummaryService.updateMonthlySummary(
      messId,
      id,
      updateDto,
    );
  }

  @Delete("month/:year/:month")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  async deleteMonthlySummary(
    @CurrentMess() messId: string,
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.monthlySummaryService.deleteMonthlySummary(messId, year, month);
  }
}
