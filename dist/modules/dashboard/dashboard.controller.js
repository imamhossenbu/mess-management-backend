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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../../common/roles.decorator");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getAdminDashboard(req) {
        return this.dashboardService.getAdminDashboard(req.user.id);
    }
    async getMemberDashboard(req) {
        return this.dashboardService.getMemberDashboard(req.user.id);
    }
    async getDailySummary(date) {
        return this.dashboardService.getDailySummary(date);
    }
    async getMonthlySummary(year, month) {
        let yearNum;
        let monthNum;
        if (year) {
            yearNum = parseInt(year);
            if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
                throw new common_1.BadRequestException("Invalid year. Year must be between 2000 and 2100");
            }
        }
        if (month) {
            monthNum = parseInt(month);
            if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
                throw new common_1.BadRequestException("Invalid month. Month must be between 1 and 12");
            }
        }
        return this.dashboardService.getMonthlySummaryForDashboard(yearNum, monthNum);
    }
    async getActivities(limit, offset) {
        const limitNum = limit ? parseInt(limit) : 10;
        const offsetNum = offset ? parseInt(offset) : 0;
        return this.dashboardService.getActivities(limitNum, offsetNum);
    }
    async getMealRateHistory(days) {
        const daysNum = days ? parseInt(days) : 30;
        return this.dashboardService.getMealRateHistory(daysNum);
    }
    async getMemberBalances() {
        return this.dashboardService.getMemberBalances();
    }
    async getMessStats() {
        return this.dashboardService.getMessStats();
    }
    async getWeeklySummary() {
        return this.dashboardService.getWeeklySummary();
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)("admin"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdminDashboard", null);
__decorate([
    (0, common_1.Get)("member"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMemberDashboard", null);
__decorate([
    (0, common_1.Get)("daily"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    __param(0, (0, common_1.Query)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDailySummary", null);
__decorate([
    (0, common_1.Get)("monthly"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    __param(0, (0, common_1.Query)("year")),
    __param(1, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMonthlySummary", null);
__decorate([
    (0, common_1.Get)("activities"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    __param(0, (0, common_1.Query)("limit")),
    __param(1, (0, common_1.Query)("offset")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getActivities", null);
__decorate([
    (0, common_1.Get)("meal-rate-history"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER"),
    __param(0, (0, common_1.Query)("days")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMealRateHistory", null);
__decorate([
    (0, common_1.Get)("member-balances"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMemberBalances", null);
__decorate([
    (0, common_1.Get)("mess-stats"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMessStats", null);
__decorate([
    (0, common_1.Get)("weekly-summary"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getWeeklySummary", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)("dashboard"),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, common_1.Controller)("dashboard"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map