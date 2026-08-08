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
exports.MonthlySummaryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const monthly_summary_service_1 = require("./monthly-summary.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const register_dto_1 = require("../auth/dto/register.dto");
const roles_decorator_1 = require("../../common/roles.decorator");
let MonthlySummaryController = class MonthlySummaryController {
    constructor(monthlySummaryService) {
        this.monthlySummaryService = monthlySummaryService;
    }
    async generate(generateDto) {
        return this.monthlySummaryService.generateMonthlySummary(generateDto.year, generateDto.month);
    }
    async findAll() {
        return this.monthlySummaryService.getAllMonthlySummaries();
    }
    async getMonthlySummary(year, month) {
        return this.monthlySummaryService.getMonthlySummary(year, month);
    }
    async getUserSummaries(userId, year, month) {
        return this.monthlySummaryService.getUserMonthlySummaries(userId, year, month);
    }
    async deleteMonthlySummary(year, month) {
        return this.monthlySummaryService.deleteMonthlySummary(year, month);
    }
};
exports.MonthlySummaryController = MonthlySummaryController;
__decorate([
    (0, common_1.Post)("generate"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Generate monthly summary for a specific month" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Monthly summary generated successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "No active users found" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GenerateMonthlySummaryDto]),
    __metadata("design:returntype", Promise)
], MonthlySummaryController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get all monthly summaries" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "List of all monthly summaries" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonthlySummaryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("month"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get monthly summary for a specific month" }),
    (0, swagger_1.ApiQuery)({ name: "year", required: true, example: 2026 }),
    (0, swagger_1.ApiQuery)({ name: "month", required: true, example: 8 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Monthly summary found",
        type: dto_1.MonthlySummaryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "No summary found for this month" }),
    __param(0, (0, common_1.Query)("year", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MonthlySummaryController.prototype, "getMonthlySummary", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get user monthly summaries" }),
    (0, swagger_1.ApiParam)({ name: "userId", description: "User UUID" }),
    (0, swagger_1.ApiQuery)({ name: "year", required: false, example: 2026 }),
    (0, swagger_1.ApiQuery)({ name: "month", required: false, example: 8 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User monthly summaries found" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "No summaries found for this user" }),
    __param(0, (0, common_1.Param)("userId", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)("year", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], MonthlySummaryController.prototype, "getUserSummaries", null);
__decorate([
    (0, common_1.Delete)("month/:year/:month"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete monthly summary for a specific month" }),
    (0, swagger_1.ApiParam)({ name: "year", example: 2026 }),
    (0, swagger_1.ApiParam)({ name: "month", example: 8 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Monthly summary deleted successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "No summary found for this month" }),
    __param(0, (0, common_1.Param)("year", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MonthlySummaryController.prototype, "deleteMonthlySummary", null);
exports.MonthlySummaryController = MonthlySummaryController = __decorate([
    (0, swagger_1.ApiTags)("monthly-summary"),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Controller)("monthly-summary"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [monthly_summary_service_1.MonthlySummaryService])
], MonthlySummaryController);
//# sourceMappingURL=monthly-summary.controller.js.map