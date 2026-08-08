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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const register_dto_1 = require("../auth/dto/register.dto");
const roles_decorator_1 = require("../../common/roles.decorator");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async create(createPaymentDto) {
        return this.paymentsService.create(createPaymentDto);
    }
    async findAll() {
        return this.paymentsService.findAll();
    }
    async getAllUserBalances() {
        return this.paymentsService.getAllUserBalances();
    }
    async getMonthlySummary(year, month) {
        const queryYear = year || new Date().getFullYear();
        const queryMonth = month || new Date().getMonth() + 1;
        return this.paymentsService.getMonthlySummary(queryYear, queryMonth);
    }
    async findByUser(userId, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.paymentsService.findByUser(userId, start, end);
    }
    async getUserBalance(userId) {
        return this.paymentsService.getUserBalance(userId);
    }
    async findByDate(date) {
        return this.paymentsService.findByDate(new Date(date));
    }
    async findByMonth(year, month) {
        return this.paymentsService.findByMonth(year, month);
    }
    async findOne(id) {
        return this.paymentsService.findOne(id);
    }
    async update(id, updatePaymentDto) {
        return this.paymentsService.update(id, updatePaymentDto);
    }
    async remove(id) {
        return this.paymentsService.remove(id);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Create a new payment" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Payment created successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get all payments" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of all payments",
        type: [dto_1.PaymentResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("balances"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get all user balances (Admin/Manager only)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "All user balances" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getAllUserBalances", null);
__decorate([
    (0, common_1.Get)("monthly"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get monthly payment summary" }),
    (0, swagger_1.ApiQuery)({ name: "year", required: false, example: 2026 }),
    (0, swagger_1.ApiQuery)({ name: "month", required: false, example: 8 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Monthly payment summary",
        type: dto_1.MonthlyPaymentSummaryDto,
    }),
    __param(0, (0, common_1.Query)("year", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getMonthlySummary", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get payments by user" }),
    (0, swagger_1.ApiParam)({ name: "userId", description: "User UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User payments",
        type: [dto_1.PaymentResponseDto],
    }),
    __param(0, (0, common_1.Param)("userId", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)("startDate")),
    __param(2, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)("user/:userId/balance"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get user balance" }),
    (0, swagger_1.ApiParam)({ name: "userId", description: "User UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User balance",
        type: dto_1.UserBalanceDto,
    }),
    __param(0, (0, common_1.Param)("userId", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getUserBalance", null);
__decorate([
    (0, common_1.Get)("date/:date"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get payments by date" }),
    (0, swagger_1.ApiParam)({ name: "date", example: "2026-08-08" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Date payments",
        type: [dto_1.PaymentResponseDto],
    }),
    __param(0, (0, common_1.Param)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findByDate", null);
__decorate([
    (0, common_1.Get)("month/:year/:month"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get payments by month" }),
    (0, swagger_1.ApiParam)({ name: "year", example: 2026 }),
    (0, swagger_1.ApiParam)({ name: "month", example: 8 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Month payments",
        type: [dto_1.PaymentResponseDto],
    }),
    __param(0, (0, common_1.Param)("year", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findByMonth", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get a payment by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Payment UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Payment found",
        type: dto_1.PaymentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Payment not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Update a payment" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Payment UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Payment updated successfully",
        type: dto_1.PaymentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Payment not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete a payment" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Payment UUID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Payment deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Payment not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "remove", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)("payments"),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Controller)("payments"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map