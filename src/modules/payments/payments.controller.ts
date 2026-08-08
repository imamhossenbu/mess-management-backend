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
  ApiSecurity,
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
import { Role } from "../auth/dto/register.dto";
import { Roles } from "src/common/roles.decorator";

@ApiTags("payments")
@ApiSecurity("JWT-auth")
@Controller("payments")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ==================== CREATE ====================

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Create a new payment" })
  @ApiResponse({ status: 201, description: "Payment created successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  // ==================== FIND ====================

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get all payments" })
  @ApiResponse({
    status: 200,
    description: "List of all payments",
    type: [PaymentResponseDto],
  })
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Get("balances")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Get all user balances (Admin/Manager only)" })
  @ApiResponse({ status: 200, description: "All user balances" })
  async getAllUserBalances() {
    return this.paymentsService.getAllUserBalances();
  }

  @Get("monthly")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get monthly payment summary" })
  @ApiQuery({ name: "year", required: false, example: 2026 })
  @ApiQuery({ name: "month", required: false, example: 8 })
  @ApiResponse({
    status: 200,
    description: "Monthly payment summary",
    type: MonthlyPaymentSummaryDto,
  })
  async getMonthlySummary(
    @Query("year", ParseIntPipe) year?: number,
    @Query("month", ParseIntPipe) month?: number,
  ) {
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;
    return this.paymentsService.getMonthlySummary(queryYear, queryMonth);
  }

  @Get("user/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get payments by user" })
  @ApiParam({ name: "userId", description: "User UUID" })
  @ApiResponse({
    status: 200,
    description: "User payments",
    type: [PaymentResponseDto],
  })
  async findByUser(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.paymentsService.findByUser(userId, start, end);
  }

  @Get("user/:userId/balance")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get user balance" })
  @ApiParam({ name: "userId", description: "User UUID" })
  @ApiResponse({
    status: 200,
    description: "User balance",
    type: UserBalanceDto,
  })
  async getUserBalance(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.paymentsService.getUserBalance(userId);
  }

  @Get("date/:date")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get payments by date" })
  @ApiParam({ name: "date", example: "2026-08-08" })
  @ApiResponse({
    status: 200,
    description: "Date payments",
    type: [PaymentResponseDto],
  })
  async findByDate(@Param("date") date: string) {
    return this.paymentsService.findByDate(new Date(date));
  }

  @Get("month/:year/:month")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get payments by month" })
  @ApiParam({ name: "year", example: 2026 })
  @ApiParam({ name: "month", example: 8 })
  @ApiResponse({
    status: 200,
    description: "Month payments",
    type: [PaymentResponseDto],
  })
  async findByMonth(
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.paymentsService.findByMonth(year, month);
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get a payment by ID" })
  @ApiParam({ name: "id", description: "Payment UUID" })
  @ApiResponse({
    status: 200,
    description: "Payment found",
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: "Payment not found" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.paymentsService.findOne(id);
  }

  // ==================== UPDATE ====================

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Update a payment" })
  @ApiParam({ name: "id", description: "Payment UUID" })
  @ApiResponse({
    status: 200,
    description: "Payment updated successfully",
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: "Payment not found" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  // ==================== DELETE ====================

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a payment" })
  @ApiParam({ name: "id", description: "Payment UUID" })
  @ApiResponse({ status: 200, description: "Payment deleted successfully" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.paymentsService.remove(id);
  }
}
