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
exports.MealsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const meals_service_1 = require("./meals.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const register_dto_1 = require("../auth/dto/register.dto");
const roles_decorator_1 = require("../../common/roles.decorator");
let MealsController = class MealsController {
    mealsService;
    constructor(mealsService) {
        this.mealsService = mealsService;
    }
    async create(createMealDto) {
        return this.mealsService.create(createMealDto);
    }
    async bulkEntry(bulkMealDto) {
        return this.mealsService.bulkEntry(bulkMealDto);
    }
    async singleMealEntry(singleMealDto) {
        return this.mealsService.singleMealEntry(singleMealDto);
    }
    async findAll() {
        return this.mealsService.findAll();
    }
    async getDailySummary(date) {
        const queryDate = date ? new Date(date) : new Date();
        return this.mealsService.getDailySummary(queryDate);
    }
    async getMonthlySummary(year, month) {
        const queryYear = year || new Date().getFullYear();
        const queryMonth = month || new Date().getMonth() + 1;
        return this.mealsService.getMonthlySummary(queryYear, queryMonth);
    }
    async findByUser(userId, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.mealsService.findByUser(userId, start, end);
    }
    async findByDate(date) {
        return this.mealsService.findByDate(new Date(date));
    }
    async findOne(id) {
        return this.mealsService.findOne(id);
    }
    async update(id, updateMealDto) {
        return this.mealsService.update(id, updateMealDto);
    }
    async remove(id) {
        return this.mealsService.remove(id);
    }
    async removeByDate(date) {
        return this.mealsService.removeByDate(new Date(date));
    }
};
exports.MealsController = MealsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Create a single meal entry (Admin/Manager only)" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Meal created successfully",
        type: dto_1.MealResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "Meal already exists for this date",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateMealDto]),
    __metadata("design:returntype", Promise)
], MealsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("bulk"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Bulk meal entry for a date (Admin/Manager only)" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Bulk meals created successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BulkMealEntryDto]),
    __metadata("design:returntype", Promise)
], MealsController.prototype, "bulkEntry", null);
__decorate([
    (0, common_1.Post)("single-meal-type"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: "Entry for a single meal type (morning/lunch/dinner)",
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Meals updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SingleMealEntryDto]),
    __metadata("design:returntype", Promise)
], MealsController.prototype, "singleMealEntry", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get all meals" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of all meals",
        type: [dto_1.MealResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MealsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("daily"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get daily meal summary" }),
    (0, swagger_1.ApiQuery)({ name: "date", required: false, example: "2026-08-08" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Daily meal summary",
        type: dto_1.DailyMealSummaryDto,
    }),
    __param(0, (0, common_1.Query)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MealsController.prototype, "getDailySummary", null);
__decorate([
    (0, common_1.Get)("monthly"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get monthly meal summary" }),
    (0, swagger_1.ApiQuery)({ name: "year", required: false, example: 2026 }),
    (0, swagger_1.ApiQuery)({ name: "month", required: false, example: 8 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Monthly meal summary",
        type: dto_1.MonthlyMealSummaryDto,
    }),
    __param(0, (0, common_1.Query)("year", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MealsController.prototype, "getMonthlySummary", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get meals by user ID" }),
    (0, swagger_1.ApiParam)({ name: "userId", description: "User UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User meals",
        type: [dto_1.MealResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    __param(0, (0, common_1.Param)("userId", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)("startDate")),
    __param(2, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MealsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)("date/:date"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get meals by date" }),
    (0, swagger_1.ApiParam)({ name: "date", example: "2026-08-08" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Date meals",
        type: [dto_1.MealResponseDto],
    }),
    __param(0, (0, common_1.Param)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MealsController.prototype, "findByDate", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get a meal by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Meal UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Meal found",
        type: dto_1.MealResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Meal not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MealsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Update a meal (Admin/Manager only)" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Meal UUID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Meal updated successfully",
        type: dto_1.MealResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Meal not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateMealDto]),
    __metadata("design:returntype", Promise)
], MealsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete a meal (Admin/Manager only)" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Meal UUID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Meal deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Meal not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MealsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)("date/:date"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete all meals for a date (Admin/Manager only)" }),
    (0, swagger_1.ApiParam)({ name: "date", example: "2026-08-08" }),
    __param(0, (0, common_1.Param)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MealsController.prototype, "removeByDate", null);
exports.MealsController = MealsController = __decorate([
    (0, swagger_1.ApiTags)("meals"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("meals"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [meals_service_1.MealsService])
], MealsController);
//# sourceMappingURL=meals.controller.js.map