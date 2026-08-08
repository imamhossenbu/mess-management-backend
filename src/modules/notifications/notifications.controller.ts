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
  ApiSecurity,
  ApiParam,
  ApiBearerAuth,
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
import { Role } from "../auth/dto/register.dto";
import { Roles } from "src/common/roles.decorator";

@ApiTags("notifications")
@ApiSecurity("JWT-auth")
@Controller("notifications")
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ==================== CREATE ====================

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Create a new notification" })
  @ApiResponse({
    status: 201,
    description: "Notification created successfully",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Post("bulk")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Create bulk notifications for multiple users" })
  @ApiResponse({
    status: 201,
    description: "Bulk notifications created successfully",
  })
  @ApiResponse({ status: 400, description: "Some users not found" })
  async createBulk(@Body() bulkNotificationDto: BulkNotificationDto) {
    return this.notificationsService.createBulk(bulkNotificationDto);
  }

  // ==================== SYSTEM NOTIFICATIONS ====================

  @Post("bill/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Send bill notification to a user" })
  @ApiParam({ name: "userId", description: "User UUID" })
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
  @ApiOperation({ summary: "Send payment confirmation notification" })
  @ApiParam({ name: "userId", description: "User UUID" })
  async sendPaymentConfirmation(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body("amount") amount: number,
  ) {
    return this.notificationsService.sendPaymentConfirmation(userId, amount);
  }

  @Post("meal-reminder/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Send meal reminder notification" })
  @ApiParam({ name: "userId", description: "User UUID" })
  async sendMealReminder(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body("mealType") mealType: string,
  ) {
    return this.notificationsService.sendMealReminder(userId, mealType);
  }

  @Post("inventory-alert")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Send inventory alert to all admins" })
  async sendInventoryAlert(
    @Body("type") type: string,
    @Body("quantity") quantity: number,
  ) {
    return this.notificationsService.sendInventoryAlert(type, quantity);
  }

  @Post("monthly-summary")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Send monthly summary notification to all users" })
  async sendMonthlySummary(
    @Body("year") year: number,
    @Body("month") month: number,
  ) {
    return this.notificationsService.sendMonthlySummaryNotification(
      year,
      month,
    );
  }

  // ==================== EMAIL ====================

  @Post("email")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Send email notification" })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.notificationsService.sendEmail(sendEmailDto);
  }

  // ==================== FIND ====================

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Get all notifications" })
  @ApiResponse({
    status: 200,
    description: "List of all notifications",
    type: [NotificationResponseDto],
  })
  async findAll() {
    return this.notificationsService.findAll();
  }

  @Get("me")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get my notifications" })
  @ApiResponse({
    status: 200,
    description: "My notifications",
    type: [NotificationResponseDto],
  })
  async getMyNotifications(@Request() req) {
    return this.notificationsService.findByUser(req.user.id);
  }

  @Get("me/unread-count")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get my unread notification count" })
  @ApiResponse({
    status: 200,
    description: "Unread count",
    type: UnreadCountDto,
  })
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Get("user/:userId")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Get notifications by user" })
  @ApiParam({ name: "userId", description: "User UUID" })
  @ApiResponse({
    status: 200,
    description: "User notifications",
    type: [NotificationResponseDto],
  })
  async findByUser(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get a notification by ID" })
  @ApiParam({ name: "id", description: "Notification UUID" })
  @ApiResponse({
    status: 200,
    description: "Notification found",
    type: NotificationResponseDto,
  })
  @ApiResponse({ status: 404, description: "Notification not found" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.notificationsService.findOne(id);
  }

  // ==================== UPDATE ====================

  @Patch(":id/read")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Mark a notification as read" })
  @ApiParam({ name: "id", description: "Notification UUID" })
  @ApiResponse({
    status: 200,
    description: "Notification marked as read",
    type: NotificationResponseDto,
  })
  @ApiResponse({ status: 404, description: "Notification not found" })
  async markAsRead(@Param("id", ParseUUIDPipe) id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch("me/read-all")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Mark all my notifications as read" })
  @ApiResponse({ status: 200, description: "All notifications marked as read" })
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  // ==================== DELETE ====================

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a notification" })
  @ApiParam({ name: "id", description: "Notification UUID" })
  @ApiResponse({
    status: 200,
    description: "Notification deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Notification not found" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.notificationsService.remove(id);
  }

  @Delete("me/all")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete all my notifications" })
  @ApiResponse({
    status: 200,
    description: "All notifications deleted successfully",
  })
  async removeAll(@Request() req) {
    return this.notificationsService.removeAll(req.user.id);
  }
}
