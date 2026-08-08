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
  ApiBearerAuth,
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
import { Roles } from "../../common/roles.decorator";
import { Role } from "../auth/dto/register.dto";
import { CurrentMess } from "../../common/current-mess.decorator";

@ApiTags("shop-debts")
@ApiBearerAuth("JWT-auth")
@Controller("shop-debts")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShopDebtsController {
  constructor(private readonly shopDebtsService: ShopDebtsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async create(
    @CurrentMess() messId: string,
    @Body() createShopDebtDto: CreateShopDebtDto,
  ) {
    return this.shopDebtsService.create(messId, createShopDebtDto);
  }

  @Post(":id/pay")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async payDebt(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Query("paidDate") paidDate?: string,
  ) {
    return this.shopDebtsService.payDebt(messId, id, paidDate);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findAll(@CurrentMess() messId: string) {
    return this.shopDebtsService.findAll(messId);
  }

  @Get("summary")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getSummary(@CurrentMess() messId: string) {
    return this.shopDebtsService.getSummary(messId);
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
    return this.shopDebtsService.getMonthlySummary(
      messId,
      queryYear,
      queryMonth,
    );
  }

  @Get("monthly-report")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getMonthlyReport(
    @CurrentMess() messId: string,
    @Query("year", ParseIntPipe) year: number,
    @Query("month", ParseIntPipe) month: number,
  ) {
    return this.shopDebtsService.getMonthlySummaryReport(messId, year, month);
  }

  @Get("shop/:shopName")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findByShop(
    @CurrentMess() messId: string,
    @Param("shopName") shopName: string,
  ) {
    return this.shopDebtsService.findByShop(messId, shopName);
  }

  @Get("date/:date")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findByDate(@CurrentMess() messId: string, @Param("date") date: string) {
    return this.shopDebtsService.findByDate(messId, new Date(date));
  }

  @Get("month/:year/:month")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findByMonth(
    @CurrentMess() messId: string,
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.shopDebtsService.findByMonth(messId, year, month);
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findOne(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.shopDebtsService.findOne(messId, id);
  }

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async update(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateShopDebtDto: UpdateShopDebtDto,
  ) {
    return this.shopDebtsService.update(messId, id, updateShopDebtDto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.shopDebtsService.remove(messId, id);
  }
}
