// src/modules/payments/payments.controller.ts
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
import { PaymentsService } from "./payments.service";
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentResponseDto,
  UserBalanceDto,
  MonthlyPaymentSummaryDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";
import { Role } from "../auth/dto/register.dto";
import { CurrentMess } from "../../common/current-mess.decorator";

@ApiTags("payments")
@ApiBearerAuth("JWT-auth")
@Controller("payments")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async create(
    @CurrentMess() messId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(messId, createPaymentDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findAll(@CurrentMess() messId: string) {
    return this.paymentsService.findAll(messId);
  }

  @Get("balances")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async getAllUserBalances(@CurrentMess() messId: string) {
    return this.paymentsService.getAllUserBalances(messId);
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
    return this.paymentsService.getMonthlySummary(
      messId,
      queryYear,
      queryMonth,
    );
  }

  @Get("user/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findByUser(
    @CurrentMess() messId: string,
    @Param("userId", ParseUUIDPipe) userId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.paymentsService.findByUser(messId, userId, start, end);
  }

  @Get("user/:userId/balance")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getUserBalance(
    @CurrentMess() messId: string,
    @Param("userId", ParseUUIDPipe) userId: string,
  ) {
    return this.paymentsService.getUserBalance(messId, userId);
  }

  @Get("date/:date")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findByDate(@CurrentMess() messId: string, @Param("date") date: string) {
    return this.paymentsService.findByDate(messId, new Date(date));
  }

  @Get("month/:year/:month")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findByMonth(
    @CurrentMess() messId: string,
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.paymentsService.findByMonth(messId, year, month);
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findOne(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.paymentsService.findOne(messId, id);
  }

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async update(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(messId, id, updatePaymentDto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentMess() messId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.paymentsService.remove(messId, id);
  }
}
