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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_service_1 = require("./inventory.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../../common/roles.decorator");
const register_dto_1 = require("../auth/dto/register.dto");
const client_1 = require("@prisma/client");
const current_mess_decorator_1 = require("../../common/current-mess.decorator");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async getAll(messId) {
        return this.inventoryService.getAllInventory(messId);
    }
    async getSummary(messId) {
        return this.inventoryService.getSummary(messId);
    }
    async getByType(messId, type) {
        return this.inventoryService.getInventory(messId, type);
    }
    async getLogs(messId, type) {
        return this.inventoryService.getLogs(messId, type);
    }
    async checkAvailability(messId, type, quantity) {
        return this.inventoryService.checkAvailability(messId, type, quantity);
    }
    async add(messId, addInventoryDto) {
        return this.inventoryService.addInventory(messId, addInventoryDto);
    }
    async remove(messId, removeInventoryDto) {
        return this.inventoryService.removeInventory(messId, removeInventoryDto);
    }
    async set(messId, setInventoryDto) {
        return this.inventoryService.setInventory(messId, setInventoryDto);
    }
    async bulkAdd(messId, items) {
        return this.inventoryService.bulkAdd(messId, items);
    }
    async bulkRemove(messId, items) {
        return this.inventoryService.bulkRemove(messId, items);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)("summary"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)("type/:type"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Param)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof client_1.InventoryType !== "undefined" && client_1.InventoryType) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getByType", null);
__decorate([
    (0, common_1.Get)("logs"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof client_1.InventoryType !== "undefined" && client_1.InventoryType) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)("check/:type"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Param)("type")),
    __param(2, (0, common_1.Query)("quantity")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof client_1.InventoryType !== "undefined" && client_1.InventoryType) === "function" ? _c : Object, Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.Post)("add"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AddInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "add", null);
__decorate([
    (0, common_1.Post)("remove"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RemoveInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)("set"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.SetInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "set", null);
__decorate([
    (0, common_1.Post)("bulk-add"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "bulkAdd", null);
__decorate([
    (0, common_1.Post)("bulk-remove"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER),
    __param(0, (0, current_mess_decorator_1.CurrentMess)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "bulkRemove", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)("inventory"),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, common_1.Controller)("inventory"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map