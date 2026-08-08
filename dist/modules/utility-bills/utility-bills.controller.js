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
exports.UtilityBillsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const utility_bills_service_1 = require("./utility-bills.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const register_dto_1 = require("../auth/dto/register.dto");
const roles_decorator_1 = require("../../common/roles.decorator");
let UtilityBillsController = class UtilityBillsController {
    constructor(utilityBillsService) {
        this.utilityBillsService = utilityBillsService;
    }
    async create(createUtilityBillDto) {
        return this.utilityBillsService.create(createUtilityBillDto);
    }
    async findAll() {
        return this.utilityBillsService.findAll();
    }
    async getSummary() {
        return this.utilityBillsService.getSummary();
    }
    async getMonthlySummary(year, month) {
        const queryYear = year || new Date().getFullYear();
        const queryMonth = month || new Date().getMonth() + 1;
        return this.utilityBillsService.getMonthlySummary(queryYear, queryMonth);
    }
    async findByMonth(year, month) {
        return this.utilityBillsService.findByMonth(year, month);
    }
    async findOne(id) {
        return this.utilityBillsService.findOne(id);
    }
    async update(id, updateUtilityBillDto) {
        return this.utilityBillsService.update(id, updateUtilityBillDto);
    }
    async remove(id) {
        return this.utilityBillsService.remove(id);
    }
    async removeByMonth(year, month) {
        return this.utilityBillsService.removeByMonth(year, month);
    }
};
exports.UtilityBillsController = UtilityBillsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Create a new utility bill" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Utility bill created successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bill already exists for this month",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUtilityBillDto]),
    __metadata("design:returntype", Promise)
], UtilityBillsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get all utility bills" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of all utility bills",
        type: [dto_1.UtilityBillResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UtilityBillsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("summary"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get utility bills summary" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Utility bills summary",
        type: dto_1.UtilityBillSummaryDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UtilityBillsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)("monthly"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get monthly utility bills summary" }),
    (0, swagger_1.ApiQuery)({ name: "year", required: false, example: 2026 }),
    (0, swagger_1.ApiQuery)({ name: "month", required: false, example: 8 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Monthly utility bills summary",
        type: dto_1.MonthlyUtilitySummaryDto,
    }),
    __param(0, (0, common_1.Query)("year", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UtilityBillsController.prototype, "getMonthlySummary", null);
__decorate([
    (0, common_1.Get)("month/:year/:month"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get all utility bills for a specific month" }),
    (0, swagger_1.ApiParam)({ name: "year", example: 2026 }),
    (0, swagger_1.ApiParam)({ name: "month", example: 8 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Monthly utility bills",
        type: [dto_1.UtilityBillResponseDto],
    }),
    __param(0, (0, common_1.Param)("year", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UtilityBillsController.prototype, "findByMonth", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get a utility bill by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Utility bill UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Utility bill found",
        type: dto_1.UtilityBillResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Utility bill not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UtilityBillsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Update a utility bill" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Utility bill UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Utility bill updated successfully",
        type: dto_1.UtilityBillResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Utility bill not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateUtilityBillDto]),
    __metadata("design:returntype", Promise)
], UtilityBillsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete a utility bill" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Utility bill UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Utility bill deleted successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Utility bill not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UtilityBillsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)("month/:year/:month"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete all utility bills for a month" }),
    (0, swagger_1.ApiParam)({ name: "year", example: 2026 }),
    (0, swagger_1.ApiParam)({ name: "month", example: 8 }),
    __param(0, (0, common_1.Param)("year", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UtilityBillsController.prototype, "removeByMonth", null);
exports.UtilityBillsController = UtilityBillsController = __decorate([
    (0, swagger_1.ApiTags)("utility-bills"),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Controller)("utility-bills"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [utility_bills_service_1.UtilityBillsService])
], UtilityBillsController);
//# sourceMappingURL=utility-bills.controller.js.map