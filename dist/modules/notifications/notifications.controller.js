"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notifications_service_1 = require("./notifications.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const register_dto_1 = require("../auth/dto/register.dto");
const roles_decorator_1 = require("../../common/roles.decorator");
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async create(createNotificationDto) {
        return this.notificationsService.create(createNotificationDto);
    }
    async createBulk(bulkNotificationDto) {
        return this.notificationsService.createBulk(bulkNotificationDto);
    }
    async sendBillNotification(userId, amount, dueDate) {
        return this.notificationsService.sendBillNotification(userId, amount, new Date(dueDate));
    }
    async sendPaymentConfirmation(userId, amount) {
        return this.notificationsService.sendPaymentConfirmation(userId, amount);
    }
    async sendMealReminder(userId, mealType) {
        return this.notificationsService.sendMealReminder(userId, mealType);
    }
    async sendInventoryAlert(type, quantity) {
        return this.notificationsService.sendInventoryAlert(type, quantity);
    }
    async sendMonthlySummary(year, month) {
        return this.notificationsService.sendMonthlySummaryNotification(year, month);
    }
    async sendEmail(sendEmailDto) {
        return this.notificationsService.sendEmail(sendEmailDto);
    }
    async findAll() {
        return this.notificationsService.findAll();
    }
    async getMyNotifications(req) {
        return this.notificationsService.findByUser(req.user.id);
    }
    async getUnreadCount(req) {
        return this.notificationsService.getUnreadCount(req.user.id);
    }
    async findByUser(userId) {
        return this.notificationsService.findByUser(userId);
    }
    async findOne(id) {
        return this.notificationsService.findOne(id);
    }
    async markAsRead(id) {
        return this.notificationsService.markAsRead(id);
    }
    async markAllAsRead(req) {
        return this.notificationsService.markAllAsRead(req.user.id);
    }
    async remove(id) {
        return this.notificationsService.remove(id);
    }
    async removeAll(req) {
        return this.notificationsService.removeAll(req.user.id);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Create a new notification" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Notification created successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("bulk"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Create bulk notifications for multiple users" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Bulk notifications created successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Some users not found" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BulkNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "createBulk", null);
__decorate([
    (0, common_1.Post)("bill/:userId"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Send bill notification to a user" }),
    (0, swagger_1.ApiParam)({ name: "userId", description: "User UUID" }),
    __param(0, (0, common_1.Param)("userId", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)("amount")),
    __param(2, (0, common_1.Body)("dueDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendBillNotification", null);
__decorate([
    (0, common_1.Post)("payment/:userId"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Send payment confirmation notification" }),
    (0, swagger_1.ApiParam)({ name: "userId", description: "User UUID" }),
    __param(0, (0, common_1.Param)("userId", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)("amount")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendPaymentConfirmation", null);
__decorate([
    (0, common_1.Post)("meal-reminder/:userId"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Send meal reminder notification" }),
    (0, swagger_1.ApiParam)({ name: "userId", description: "User UUID" }),
    __param(0, (0, common_1.Param)("userId", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)("mealType")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendMealReminder", null);
__decorate([
    (0, common_1.Post)("inventory-alert"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Send inventory alert to all admins" }),
    __param(0, (0, common_1.Body)("type")),
    __param(1, (0, common_1.Body)("quantity")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendInventoryAlert", null);
__decorate([
    (0, common_1.Post)("monthly-summary"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Send monthly summary notification to all users" }),
    __param(0, (0, common_1.Body)("year")),
    __param(1, (0, common_1.Body)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendMonthlySummary", null);
__decorate([
    (0, common_1.Post)("email"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Send email notification" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SendEmailDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get all notifications" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of all notifications",
        type: [dto_1.NotificationResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get my notifications" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "My notifications",
        type: [dto_1.NotificationResponseDto],
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getMyNotifications", null);
__decorate([
    (0, common_1.Get)("me/unread-count"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get my unread notification count" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Unread count",
        type: dto_1.UnreadCountDto,
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get notifications by user" }),
    (0, swagger_1.ApiParam)({ name: "userId", description: "User UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User notifications",
        type: [dto_1.NotificationResponseDto],
    }),
    __param(0, (0, common_1.Param)("userId", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get a notification by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Notification UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Notification found",
        type: dto_1.NotificationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Notification not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id/read"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Mark a notification as read" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Notification UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Notification marked as read",
        type: dto_1.NotificationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Notification not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)("me/read-all"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Mark all my notifications as read" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "All notifications marked as read" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete a notification" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Notification UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Notification deleted successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Notification not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)("me/all"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete all my notifications" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "All notifications deleted successfully",
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "removeAll", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)("notifications"),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Controller)("notifications"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map