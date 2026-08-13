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
const register_dto_1 = require("../auth/dto/register.dto");
const current_mess_decorator_1 = require("../../common/current-mess.decorator");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getAdminDashboard(messId) {
        return this.dashboardService.getAdminDashboard(messId);
    }
    async getMemberDashboard(req) {
        return this.dashboardService.getMemberDashboard(req.user.id);
    }
    async getDailySummary(messId, date) {
        return this.dashboardService.getDailySummary(messId, date);
    }
    async getMonthlySummary(messId, year, month) {
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
        return this.dashboardService.getMonthlySummaryForDashboard(messId, yearNum, monthNum);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)("admin"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdminDashboard", null);
__decorate([
    (0, common_1.Get)("member"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMemberDashboard", null);
__decorate([
    (0, common_1.Get)("daily"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Query)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDailySummary", null);
__decorate([
    (0, common_1.Get)("monthly"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Query)("year")),
    __param(2, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMonthlySummary", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)("dashboard"),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, common_1.Controller)("dashboard"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map