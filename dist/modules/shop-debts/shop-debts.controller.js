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
exports.ShopDebtsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shop_debts_service_1 = require("./shop-debts.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../../common/roles.decorator");
let ShopDebtsController = class ShopDebtsController {
    constructor(shopDebtsService) {
        this.shopDebtsService = shopDebtsService;
    }
    async create(createShopDebtDto) {
        return this.shopDebtsService.create(createShopDebtDto);
    }
    async payDebt(id, paidDate) {
        return this.shopDebtsService.payDebt(id, paidDate);
    }
    async findAll() {
        return this.shopDebtsService.findAll();
    }
    async getSummary() {
        return this.shopDebtsService.getSummary();
    }
    async getMonthlySummary(year, month) {
        const queryYear = year || new Date().getFullYear();
        const queryMonth = month || new Date().getMonth() + 1;
        return this.shopDebtsService.getMonthlySummary(queryYear, queryMonth);
    }
    async getMonthlyReport(year, month) {
        return this.shopDebtsService.getMonthlySummaryReport(year, month);
    }
    async findByShop(shopName) {
        return this.shopDebtsService.findByShop(shopName);
    }
    async findByDate(date) {
        return this.shopDebtsService.findByDate(new Date(date));
    }
    async findByMonth(year, month) {
        return this.shopDebtsService.findByMonth(year, month);
    }
    async findOne(id) {
        return this.shopDebtsService.findOne(id);
    }
    async update(id, updateShopDebtDto) {
        return this.shopDebtsService.update(id, updateShopDebtDto);
    }
    async remove(id) {
        return this.shopDebtsService.remove(id);
    }
};
exports.ShopDebtsController = ShopDebtsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new shop debt" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateShopDebtDto]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(":id/pay"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER"),
    (0, swagger_1.ApiOperation)({ summary: "Pay a shop debt" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)("paidDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "payDebt", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get all shop debts" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("summary"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get shop debt summary" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)("monthly"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get monthly shop debt summary" }),
    __param(0, (0, common_1.Query)("year", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "getMonthlySummary", null);
__decorate([
    (0, common_1.Get)("monthly-report"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get monthly shop debt report" }),
    __param(0, (0, common_1.Query)("year", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "getMonthlyReport", null);
__decorate([
    (0, common_1.Get)("shop/:shopName"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get shop debts by shop name" }),
    __param(0, (0, common_1.Param)("shopName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "findByShop", null);
__decorate([
    (0, common_1.Get)("date/:date"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get shop debts by date" }),
    __param(0, (0, common_1.Param)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "findByDate", null);
__decorate([
    (0, common_1.Get)("month/:year/:month"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get shop debts by month" }),
    __param(0, (0, common_1.Param)("year", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("month", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "findByMonth", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get shop debt by ID" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER"),
    (0, swagger_1.ApiOperation)({ summary: "Update shop debt" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateShopDebtDto]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete shop debt" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "remove", null);
exports.ShopDebtsController = ShopDebtsController = __decorate([
    (0, swagger_1.ApiTags)("shop-debts"),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, common_1.Controller)("shop-debts"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [shop_debts_service_1.ShopDebtsService])
], ShopDebtsController);
//# sourceMappingURL=shop-debts.controller.js.map