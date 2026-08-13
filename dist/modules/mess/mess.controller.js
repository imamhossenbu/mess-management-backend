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
exports.MessController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mess_service_1 = require("./mess.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../../common/roles.decorator");
const register_dto_1 = require("../auth/dto/register.dto");
let MessController = class MessController {
    constructor(messService) {
        this.messService = messService;
    }
    async create(req, createMessDto) {
        throw new common_1.ForbiddenException("Creation of mess is disabled.");
    }
    async getUserMesses(req) {
        return this.messService.getUserMesses(req.user.id);
    }
    async findOne(id) {
        return this.messService.findOne(id);
    }
    async update(id, updateMessDto) {
        return this.messService.update(id, updateMessDto);
    }
    async remove(id) {
        throw new common_1.ForbiddenException("Deletion of mess is disabled.");
    }
    async getMembers(id) {
        return this.messService.getMembers(id);
    }
    async addMember(id, addMemberDto) {
        return this.messService.addMember(id, addMemberDto.userId, addMemberDto.role);
    }
    async removeMember(id, userId) {
        return this.messService.removeMember(id, userId);
    }
    async updateMemberRole(id, userId, updateRoleDto) {
        return this.messService.updateMemberRole(id, userId, updateRoleDto.role);
    }
};
exports.MessController = MessController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Create a new mess" }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateMessDto]),
    __metadata("design:returntype", Promise)
], MessController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("user/messes"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get all messes for the current user" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessController.prototype, "getUserMesses", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get mess details" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Mess ID" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Update mess details" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Mess ID" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateMessDto]),
    __metadata("design:returntype", Promise)
], MessController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Delete a mess" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Mess ID" }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(":id/members"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN, register_dto_1.Role.MANAGER, register_dto_1.Role.MEMBER),
    (0, swagger_1.ApiOperation)({ summary: "Get all members of a mess" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Mess ID" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Post)(":id/members"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Add a member to the mess" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Mess ID" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AddMemberDto]),
    __metadata("design:returntype", Promise)
], MessController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(":id/members/:userId"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Remove a member from the mess" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Mess ID" }),
    (0, swagger_1.ApiParam)({ name: "userId", description: "User ID" }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)("userId", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MessController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Patch)(":id/members/:userId/role"),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Update member role" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Mess ID" }),
    (0, swagger_1.ApiParam)({ name: "userId", description: "User ID" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)("userId", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], MessController.prototype, "updateMemberRole", null);
exports.MessController = MessController = __decorate([
    (0, swagger_1.ApiTags)("mess"),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, common_1.Controller)("mess"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [mess_service_1.MessService])
], MessController);
//# sourceMappingURL=mess.controller.js.map