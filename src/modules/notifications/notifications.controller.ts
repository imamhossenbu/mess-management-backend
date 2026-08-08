// src/modules/notifications/notifications.controller.ts
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
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service";
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationResponseDto,
  UnreadCountDto,
  BulkNotificationDto,
  SendEmailDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";
import { Role } from "../auth/dto/register.dto";

@ApiTags("notifications")
@ApiBearerAuth("JWT-auth")
@Controller("notifications")
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Post("bulk")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async createBulk(@Body() bulkNotificationDto: BulkNotificationDto) {
    return this.notificationsService.createBulk(bulkNotificationDto);
  }

  @Post("bill/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async sendBillNotification(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body("amount") amount: number,
    @Body("dueDate") dueDate: string,
  ) {
    return this.notificationsService.sendBillNotification(
      userId,
      amount,
      new Date(dueDate),
    );
  }

  @Post("payment/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async sendPaymentConfirmation(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body("amount") amount: number,
  ) {
    return this.notificationsService.sendPaymentConfirmation(userId, amount);
  }

  @Post("meal-reminder/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async sendMealReminder(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body("mealType") mealType: string,
  ) {
    return this.notificationsService.sendMealReminder(userId, mealType);
  }

  @Post("inventory-alert")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async sendInventoryAlert(
    @Body("type") type: string,
    @Body("quantity") quantity: number,
  ) {
    return this.notificationsService.sendInventoryAlert(type, quantity);
  }

  @Post("monthly-summary")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async sendMonthlySummary(
    @Body("year") year: number,
    @Body("month") month: number,
  ) {
    return this.notificationsService.sendMonthlySummaryNotification(
      year,
      month,
    );
  }

  @Post("email")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.notificationsService.sendEmail(sendEmailDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async findAll() {
    return this.notificationsService.findAll();
  }

  @Get("me")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getMyNotifications(@Request() req) {
    return this.notificationsService.findByUser(req.user.id);
  }

  @Get("me/unread-count")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Get("user/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async findByUser(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(":id/read")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async markAsRead(@Param("id", ParseUUIDPipe) id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch("me/read-all")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.notificationsService.remove(id);
  }

  @Delete("me/all")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @HttpCode(HttpStatus.OK)
  async removeAll(@Request() req) {
    return this.notificationsService.removeAll(req.user.id);
  }
}
