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
let ShopDebtsController = class ShopDebtsController {
    constructor(shopDebtsService) {
        this.shopDebtsService = shopDebtsService;
    }
    async createDebt(createShopDebtDto, req) {
        return this.shopDebtsService.createDebt(createShopDebtDto, req.user.id);
    }
    async createBulkDebt(createBulkShopDebtDto, req) {
        return this.shopDebtsService.createBulkDebt(createBulkShopDebtDto, req.user.id);
    }
    async createPayment(createShopPaymentDto, req) {
        return this.shopDebtsService.createPayment(createShopPaymentDto, req.user.id);
    }
    async getSummary() {
        return this.shopDebtsService.getSummary();
    }
    async getMonthlyData(year, month, startDate, endDate) {
        const queryYear = year ? parseInt(year) : new Date().getFullYear();
        const queryMonth = month ? parseInt(month) : new Date().getMonth() + 1;
        return this.shopDebtsService.getMonthlyData(queryYear, queryMonth, startDate, endDate);
    }
    async updateDebt(id, updateShopDebtDto) {
        return this.shopDebtsService.updateDebt(id, updateShopDebtDto);
    }
    async updatePayment(id, updateShopPaymentDto) {
        return this.shopDebtsService.updatePayment(id, updateShopPaymentDto);
    }
    async removeDebt(id) {
        return this.shopDebtsService.removeDebt(id);
    }
    async removePayment(id) {
        return this.shopDebtsService.removePayment(id);
    }
};
exports.ShopDebtsController = ShopDebtsController;
__decorate([
    (0, common_1.Post)("debt"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new shop debt" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateShopDebtDto, Object]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "createDebt", null);
__decorate([
    (0, common_1.Post)("debt/bulk"),
    (0, swagger_1.ApiOperation)({ summary: "Create multiple shop debts at once" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBulkShopDebtDto, Object]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "createBulkDebt", null);
__decorate([
    (0, common_1.Post)("payment"),
    (0, swagger_1.ApiOperation)({ summary: "Log a shop payment" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateShopPaymentDto, Object]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)("summary"),
    (0, swagger_1.ApiOperation)({ summary: "Get global shop debt summary" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)("monthly"),
    (0, swagger_1.ApiOperation)({ summary: "Get monthly or custom range shop debt data" }),
    __param(0, (0, common_1.Query)("year")),
    __param(1, (0, common_1.Query)("month")),
    __param(2, (0, common_1.Query)("startDate")),
    __param(3, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "getMonthlyData", null);
__decorate([
    (0, common_1.Patch)("debt/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Update shop debt" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateShopDebtDto]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "updateDebt", null);
__decorate([
    (0, common_1.Patch)("payment/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Update shop payment" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "updatePayment", null);
__decorate([
    (0, common_1.Delete)("debt/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete shop debt" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "removeDebt", null);
__decorate([
    (0, common_1.Delete)("payment/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete shop payment" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopDebtsController.prototype, "removePayment", null);
exports.ShopDebtsController = ShopDebtsController = __decorate([
    (0, swagger_1.ApiTags)("shop-debts"),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, common_1.Controller)("shop-debts"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [shop_debts_service_1.ShopDebtsService])
], ShopDebtsController);
//# sourceMappingURL=shop-debts.controller.js.map