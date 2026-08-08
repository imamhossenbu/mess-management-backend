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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_service_1 = require("./inventory.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const register_dto_1 = require("../auth/dto/register.dto");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../../common/roles.decorator");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async getAll() {
        return this.inventoryService.getAllInventory();
    }
    async getSummary() {
        return this.inventoryService.getSummary();
    }
    async getByType(type) {
        return this.inventoryService.getInventory(type);
    }
    async getLogs(type) {
        return this.inventoryService.getLogs(type);
    }
    async checkAvailability(type, quantity) {
        return this.inventoryService.checkAvailability(type, quantity);
    }
    async add(addInventoryDto) {
        return this.inventoryService.addInventory(addInventoryDto);
    }
    async remove(removeInventoryDto) {
        return this.inventoryService.removeInventory(removeInventoryDto);
    }
    async set(setInventoryDto) {
        return this.inventoryService.setInventory(setInventoryDto);
    }
    async bulkAdd(items) {
        return this.inventoryService.bulkAdd(items);
    }
    async bulkRemove(items) {
        return this.inventoryService.bulkRemove(items);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get all inventory" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of all inventory",
        type: [dto_1.InventoryResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)("summary"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get inventory summary (meat + fish)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Inventory summary",
        type: dto_1.InventorySummaryDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)("type/:type"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get inventory by type" }),
    (0, swagger_1.ApiParam)({ name: "type", enum: client_1.InventoryType }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Inventory found",
        type: dto_1.InventoryResponseDto,
    }),
    __param(0, (0, common_1.Param)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getByType", null);
__decorate([
    (0, common_1.Get)("logs"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get inventory logs" }),
    (0, swagger_1.ApiQuery)({ name: "type", enum: client_1.InventoryType, required: false }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Inventory logs",
        type: [dto_1.InventoryLogResponseDto],
    }),
    __param(0, (0, common_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)("check/:type"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Check inventory availability" }),
    (0, swagger_1.ApiParam)({ name: "type", enum: client_1.InventoryType }),
    (0, swagger_1.ApiQuery)({ name: "quantity", type: Number, example: 5 }),
    __param(0, (0, common_1.Param)("type")),
    __param(1, (0, common_1.Query)("quantity")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.Post)("add"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Add inventory (বাজার করলে)" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Inventory added successfully",
        type: dto_1.InventoryResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AddInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "add", null);
__decorate([
    (0, common_1.Post)("remove"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Remove inventory (রান্নায় ব্যবহার করলে)" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Inventory removed successfully",
        type: dto_1.InventoryResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RemoveInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)("set"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Set inventory manually (স্টক চেক করে আপডেট)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Inventory set successfully",
        type: dto_1.InventoryResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SetInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "set", null);
__decorate([
    (0, common_1.Post)("bulk-add"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Bulk add inventory" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "bulkAdd", null);
__decorate([
    (0, common_1.Post)("bulk-remove"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Bulk remove inventory" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "bulkRemove", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)("inventory"),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Controller)("inventory"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map