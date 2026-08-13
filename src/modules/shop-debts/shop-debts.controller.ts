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
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ShopDebtsService } from "./shop-debts.service";
import { CreateShopDebtDto, UpdateShopDebtDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";

@ApiTags("shop-debts")
@ApiBearerAuth("JWT-auth")
@Controller("shop-debts")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShopDebtsController {
  constructor(private readonly shopDebtsService: ShopDebtsService) {}

  @Post()
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Create a new shop debt" })
  async create(@Body() createShopDebtDto: CreateShopDebtDto) {
    return this.shopDebtsService.create(createShopDebtDto);
  }

  @Post(":id/pay")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Pay a shop debt" })
  async payDebt(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("paidDate") paidDate?: string,
  ) {
    return this.shopDebtsService.payDebt(id, paidDate);
  }

  @Get()
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get all shop debts" })
  async findAll() {
    return this.shopDebtsService.findAll();
  }

  @Get("summary")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get shop debt summary" })
  async getSummary() {
    return this.shopDebtsService.getSummary();
  }

  @Get("monthly")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get monthly shop debt summary" })
  async getMonthlySummary(
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;
    return this.shopDebtsService.getMonthlySummary(queryYear, queryMonth);
  }

  @Get("monthly-report")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get monthly shop debt report" })
  async getMonthlyReport(
    @Query("year", ParseIntPipe) year: number,
    @Query("month", ParseIntPipe) month: number,
  ) {
    return this.shopDebtsService.getMonthlySummaryReport(year, month);
  }

  @Get("shop/:shopName")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get shop debts by shop name" })
  async findByShop(@Param("shopName") shopName: string) {
    return this.shopDebtsService.findByShop(shopName);
  }

  @Get("date/:date")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get shop debts by date" })
  async findByDate(@Param("date") date: string) {
    return this.shopDebtsService.findByDate(new Date(date));
  }

  @Get("month/:year/:month")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get shop debts by month" })
  async findByMonth(
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.shopDebtsService.findByMonth(year, month);
  }

  @Get(":id")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get shop debt by ID" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.shopDebtsService.findOne(id);
  }

  @Patch(":id")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Update shop debt" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateShopDebtDto: UpdateShopDebtDto,
  ) {
    return this.shopDebtsService.update(id, updateShopDebtDto);
  }

  @Delete(":id")
  @Roles("ADMIN", "MANAGER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete shop debt" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.shopDebtsService.remove(id);
  }
}
