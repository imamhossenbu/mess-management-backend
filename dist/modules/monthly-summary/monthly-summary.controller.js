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
const roles_decorator_1 = require("../../common/roles.decorator");
const register_dto_1 = require("../auth/dto/register.dto");
const current_mess_decorator_1 = require("../../common/current-mess.decorator");
let MonthlySummaryController = class MonthlySummaryController {
    constructor(monthlySummaryService) {
        this.monthlySummaryService = monthlySummaryService;
    }
    async generate(messId, generateDto) {
        return this.monthlySummaryService.generateMonthlySummary(messId, generateDto.year, generateDto.month);
    }
    async findAll(messId) {
        return this.monthlySummaryService.getAllMonthlySummaries(messId);
    }
    async getMonthlySummary(messId, year, month) {
        return this.monthlySummaryService.getMonthlySummary(messId, year, month);
    }
    async getUserSummaries(messId, userId, year, month) {
        return this.monthlySummaryService.getUserMonthlySummaries(messId, userId, year, month);
    }
    async update(messId, id, updateDto) {
        return this.monthlySummaryService.updateMonthlySummary(messId, id, updateDto);
    }
    async deleteMonthlySummary(messId, year, month) {
        return this.monthlySummaryService.deleteMonthlySummary(messId, year, month);
    }
};
exports.MonthlySummaryController = MonthlySummaryController;
__decorate([
    (0, common_1.Post)("generate"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.GenerateMonthlySummaryDto]),
    __metadata("design:returntype", Promise)
], MonthlySummaryController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MonthlySummaryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("month"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Query)("year", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], MonthlySummaryController.prototype, "getMonthlySummary", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Param)("userId", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)("year", common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], MonthlySummaryController.prototype, "getUserSummaries", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.UpdateMonthlySummaryDto]),
    __metadata("design:returntype", Promise)
], MonthlySummaryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("month/:year/:month"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Param)("year", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], MonthlySummaryController.prototype, "deleteMonthlySummary", null);
exports.MonthlySummaryController = MonthlySummaryController = __decorate([
    (0, swagger_1.ApiTags)("monthly-summary"),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, common_1.Controller)("monthly-summary"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [monthly_summary_service_1.MonthlySummaryService])
], MonthlySummaryController);
//# sourceMappingURL=monthly-summary.controller.js.map