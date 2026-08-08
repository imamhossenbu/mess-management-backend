// src/modules/shop-debts/shop-debts.controller.ts
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
  ApiSecurity,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { ShopDebtsService } from "./shop-debts.service";
import {
  CreateShopDebtDto,
  UpdateShopDebtDto,
  ShopDebtResponseDto,
  ShopDebtSummaryDto,
  MonthlyShopDebtSummaryDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../auth/dto/register.dto";
import { Roles } from "src/common/roles.decorator";

@ApiTags("shop-debts")
@ApiSecurity("JWT-auth")
@Controller("shop-debts")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShopDebtsController {
  constructor(private readonly shopDebtsService: ShopDebtsService) {}

  // ==================== CREATE ====================

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Create a new shop debt" })
  @ApiResponse({ status: 201, description: "Shop debt created successfully" })
  async create(@Body() createShopDebtDto: CreateShopDebtDto) {
    return this.shopDebtsService.create(createShopDebtDto);
  }

  @Post(":id/pay")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Pay a shop debt" })
  @ApiParam({ name: "id", description: "Shop debt UUID" })
  @ApiQuery({ name: "paidDate", required: false, example: "2026-08-08" })
  @ApiResponse({ status: 200, description: "Shop debt paid successfully" })
  @ApiResponse({ status: 404, description: "Shop debt not found" })
  @ApiResponse({ status: 400, description: "Debt already paid" })
  async payDebt(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("paidDate") paidDate?: string,
  ) {
    return this.shopDebtsService.payDebt(id, paidDate);
  }

  // ==================== FIND ====================

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get all shop debts" })
  @ApiResponse({
    status: 200,
    description: "List of all shop debts",
    type: [ShopDebtResponseDto],
  })
  async findAll() {
    return this.shopDebtsService.findAll();
  }

  @Get("summary")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get shop debts summary" })
  @ApiResponse({
    status: 200,
    description: "Shop debts summary",
    type: ShopDebtSummaryDto,
  })
  async getSummary() {
    return this.shopDebtsService.getSummary();
  }

  @Get("monthly")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get monthly shop debts summary" })
  @ApiQuery({ name: "year", required: false, example: 2026 })
  @ApiQuery({ name: "month", required: false, example: 8 })
  @ApiResponse({
    status: 200,
    description: "Monthly shop debts summary",
    type: MonthlyShopDebtSummaryDto,
  })
  async getMonthlySummary(
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;
    return this.shopDebtsService.getMonthlySummary(queryYear, queryMonth);
  }

  @Get("monthly-report")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get monthly shop debts report" })
  @ApiQuery({ name: "year", required: true, example: 2026 })
  @ApiQuery({ name: "month", required: true, example: 8 })
  @ApiResponse({ status: 200, description: "Monthly shop debts report" })
  async getMonthlyReport(
    @Query("year", ParseIntPipe) year: number,
    @Query("month", ParseIntPipe) month: number,
  ) {
    return this.shopDebtsService.getMonthlySummaryReport(year, month);
  }

  @Get("shop/:shopName")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get shop debts by shop name" })
  @ApiParam({ name: "shopName", description: "Shop name" })
  @ApiResponse({
    status: 200,
    description: "Shop debts found",
    type: [ShopDebtResponseDto],
  })
  async findByShop(@Param("shopName") shopName: string) {
    return this.shopDebtsService.findByShop(shopName);
  }

  @Get("date/:date")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get shop debts by date" })
  @ApiParam({ name: "date", example: "2026-08-08" })
  @ApiResponse({
    status: 200,
    description: "Date shop debts",
    type: [ShopDebtResponseDto],
  })
  async findByDate(@Param("date") date: string) {
    return this.shopDebtsService.findByDate(new Date(date));
  }

  @Get("month/:year/:month")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get shop debts by month" })
  @ApiParam({ name: "year", example: 2026 })
  @ApiParam({ name: "month", example: 8 })
  @ApiResponse({
    status: 200,
    description: "Month shop debts",
    type: [ShopDebtResponseDto],
  })
  async findByMonth(
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.shopDebtsService.findByMonth(year, month);
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get a shop debt by ID" })
  @ApiParam({ name: "id", description: "Shop debt UUID" })
  @ApiResponse({
    status: 200,
    description: "Shop debt found",
    type: ShopDebtResponseDto,
  })
  @ApiResponse({ status: 404, description: "Shop debt not found" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.shopDebtsService.findOne(id);
  }

  // ==================== UPDATE ====================

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Update a shop debt" })
  @ApiParam({ name: "id", description: "Shop debt UUID" })
  @ApiResponse({
    status: 200,
    description: "Shop debt updated successfully",
    type: ShopDebtResponseDto,
  })
  @ApiResponse({ status: 404, description: "Shop debt not found" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateShopDebtDto: UpdateShopDebtDto,
  ) {
    return this.shopDebtsService.update(id, updateShopDebtDto);
  }

  // ==================== DELETE ====================

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a shop debt" })
  @ApiParam({ name: "id", description: "Shop debt UUID" })
  @ApiResponse({ status: 200, description: "Shop debt deleted successfully" })
  @ApiResponse({ status: 404, description: "Shop debt not found" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.shopDebtsService.remove(id);
  }
}
