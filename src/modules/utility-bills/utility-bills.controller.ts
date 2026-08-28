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
  // ParseUUIDPipe সরান
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { UtilityBillsService } from "./utility-bills.service";
import { CreateUtilityBillDto, UpdateUtilityBillDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";

@ApiTags("utility-bills")
@ApiBearerAuth("JWT-auth")
@Controller("utility-bills")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UtilityBillsController {
  constructor(private readonly utilityBillsService: UtilityBillsService) {}

  @Post()
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Create a new utility bill" })
  async create(@Body() createUtilityBillDto: CreateUtilityBillDto) {
    return this.utilityBillsService.create(createUtilityBillDto);
  }

  @Get()
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get all utility bills" })
  async findAll() {
    return this.utilityBillsService.findAll();
  }

  @Get("summary")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get utility bill summary" })
  async getSummary() {
    return this.utilityBillsService.getSummary();
  }

  @Get("monthly")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get monthly utility bill summary" })
  async getMonthlySummary(
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;
    return this.utilityBillsService.getMonthlySummary(queryYear, queryMonth);
  }

  @Get("month/:year/:month")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get utility bills by month" })
  async findByMonth(
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.utilityBillsService.findByMonth(year, month);
  }

  @Get(":id")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get utility bill by ID" })
  // ✅ ParseUUIDPipe সরান
  async findOne(@Param("id") id: string) {
    return this.utilityBillsService.findOne(id);
  }

  @Patch(":id")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Update utility bill" })
  // ✅ ParseUUIDPipe সরান
  async update(
    @Param("id") id: string,
    @Body() updateUtilityBillDto: UpdateUtilityBillDto,
  ) {
    return this.utilityBillsService.update(id, updateUtilityBillDto);
  }

  @Delete(":id")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete utility bill" })
  // ✅ ParseUUIDPipe সরান
  async remove(@Param("id") id: string) {
    return this.utilityBillsService.remove(id);
  }

  @Delete("month/:year/:month")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete all utility bills for a month" })
  async removeByMonth(
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.utilityBillsService.removeByMonth(year, month);
  }
}
