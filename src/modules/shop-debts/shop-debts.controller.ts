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
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ShopDebtsService } from "./shop-debts.service";
import { CreateShopDebtDto, UpdateShopDebtDto, CreateShopPaymentDto, CreateBulkShopDebtDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("shop-debts")
@ApiBearerAuth("JWT-auth")
@Controller("shop-debts")
@UseGuards(JwtAuthGuard)
export class ShopDebtsController {
  constructor(private readonly shopDebtsService: ShopDebtsService) {}

  @Post("debt")
  @ApiOperation({ summary: "Create a new shop debt" })
  async createDebt(@Body() createShopDebtDto: CreateShopDebtDto, @Request() req) {
    return this.shopDebtsService.createDebt(createShopDebtDto, req.user.id);
  }

  @Post("debt/bulk")
  @ApiOperation({ summary: "Create multiple shop debts at once" })
  async createBulkDebt(@Body() createBulkShopDebtDto: CreateBulkShopDebtDto, @Request() req) {
    return this.shopDebtsService.createBulkDebt(createBulkShopDebtDto, req.user.id);
  }

  @Post("payment")
  @ApiOperation({ summary: "Log a shop payment" })
  async createPayment(@Body() createShopPaymentDto: CreateShopPaymentDto, @Request() req) {
    return this.shopDebtsService.createPayment(createShopPaymentDto, req.user.id);
  }

  @Get("summary")
  @ApiOperation({ summary: "Get global shop debt summary" })
  async getSummary() {
    return this.shopDebtsService.getSummary();
  }

  @Get("monthly")
  @ApiOperation({ summary: "Get monthly shop debt data" })
  async getMonthlyData(
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;
    return this.shopDebtsService.getMonthlyData(queryYear, queryMonth);
  }

  @Patch("debt/:id")
  @ApiOperation({ summary: "Update shop debt" })
  async updateDebt(
    @Param("id") id: string,
    @Body() updateShopDebtDto: UpdateShopDebtDto,
  ) {
    return this.shopDebtsService.updateDebt(id, updateShopDebtDto);
  }

  @Patch("payment/:id")
  @ApiOperation({ summary: "Update shop payment" })
  async updatePayment(
    @Param("id") id: string,
    @Body() updateShopPaymentDto: any,
  ) {
    return this.shopDebtsService.updatePayment(id, updateShopPaymentDto);
  }

  @Delete("debt/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete shop debt" })
  async removeDebt(@Param("id") id: string) {
    return this.shopDebtsService.removeDebt(id);
  }

  @Delete("payment/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete shop payment" })
  async removePayment(@Param("id") id: string) {
    return this.shopDebtsService.removePayment(id);
  }
}
