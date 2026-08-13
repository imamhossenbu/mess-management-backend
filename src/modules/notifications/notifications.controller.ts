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

@ApiTags("notifications")
@ApiBearerAuth("JWT-auth")
@Controller("notifications")
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Create a notification" })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Post("bulk")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Create bulk notifications" })
  async createBulk(@Body() bulkNotificationDto: BulkNotificationDto) {
    return this.notificationsService.createBulk(bulkNotificationDto);
  }

  @Post("bill/:userId")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Send bill notification" })
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
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Send payment confirmation" })
  async sendPaymentConfirmation(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body("amount") amount: number,
  ) {
    return this.notificationsService.sendPaymentConfirmation(userId, amount);
  }

  @Post("meal-reminder/:userId")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Send meal reminder" })
  async sendMealReminder(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body("mealType") mealType: string,
  ) {
    return this.notificationsService.sendMealReminder(userId, mealType);
  }

  @Post("inventory-alert")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Send inventory alert" })
  async sendInventoryAlert(
    @Body("type") type: string,
    @Body("quantity") quantity: number,
  ) {
    return this.notificationsService.sendInventoryAlert(type, quantity);
  }

  @Post("monthly-summary")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Send monthly summary notification" })
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
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Send email" })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.notificationsService.sendEmail(sendEmailDto);
  }

  @Get()
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Get all notifications" })
  async findAll() {
    return this.notificationsService.findAll();
  }

  @Get("me")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get my notifications" })
  async getMyNotifications(@Request() req) {
    return this.notificationsService.findByUser(req.user.id);
  }

  @Get("me/unread-count")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get unread count" })
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Get("user/:userId")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Get notifications by user" })
  async findByUser(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  @Get(":id")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get notification by ID" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.notificationsService.findOne(id);
  }

  // ✅ Mark single notification as read
  @Patch(":id/read")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Mark notification as read" })
  @ApiParam({ name: "id", description: "Notification ID" })
  async markAsRead(@Param("id", ParseUUIDPipe) id: string) {
    return this.notificationsService.markAsRead(id);
  }

  // ✅ Mark multiple notifications as read
  @Patch("mark-read")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Mark multiple notifications as read" })
  async markMultipleAsRead(@Body("ids") ids: string[]) {
    return this.notificationsService.markMultipleAsRead(ids);
  }

  // ✅ Mark all notifications as read for current user
  @Patch("me/read-all")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Mark all notifications as read" })
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(":id")
  @Roles("ADMIN", "MANAGER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete notification" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.notificationsService.remove(id);
  }

  @Delete("me/all")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete all my notifications" })
  async removeAll(@Request() req) {
    return this.notificationsService.removeAll(req.user.id);
  }
}
