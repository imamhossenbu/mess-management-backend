// src/modules/utility-bills/utility-bills.controller.ts
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
import { UtilityBillsService } from "./utility-bills.service";
import {
  CreateUtilityBillDto,
  UpdateUtilityBillDto,
  UtilityBillResponseDto,
  MonthlyUtilitySummaryDto,
  UtilityBillSummaryDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";
import { Role } from "../auth/dto/register.dto";
import { CurrentMess } from "../../common/current-mess.decorator";

@ApiTags("utility-bills")
@ApiBearerAuth("JWT-auth")
@Controller("utility-bills")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UtilityBillsController {
  constructor(private readonly utilityBillsService: UtilityBillsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async create(
    @CurrentMess() messId: string,
    @Body() createUtilityBillDto: CreateUtilityBillDto,
  ) {
    return this.utilityBillsService.create(messId, createUtilityBillDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findAll(@CurrentMess() messId: string) {
    return this.utilityBillsService.findAll(messId);
  }

  @Get("summary")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getSummary(@CurrentMess() messId: string) {
    return this.utilityBillsService.getSummary(messId);
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
    return this.utilityBillsService.getMonthlySummary(
      messId,
      queryYear,
      queryMonth,
    );
  }

  @Get("month/:year/:month")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findByMonth(
    @CurrentMess() messId: string,
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.utilityBillsService.findByMonth(messId, year, month);
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findOne(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.utilityBillsService.findOne(messId, id);
  }

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async update(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateUtilityBillDto: UpdateUtilityBillDto,
  ) {
    return this.utilityBillsService.update(messId, id, updateUtilityBillDto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.utilityBillsService.remove(messId, id);
  }

  @Delete("month/:year/:month")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  async removeByMonth(
    @CurrentMess() messId: string,
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.utilityBillsService.removeByMonth(messId, year, month);
  }
}
