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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const register_dto_1 = require("../dto/register.dto");
const prisma_service_1 = require("../../../prisma/prisma.service");
let RolesGuard = class RolesGuard {
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride("roles", [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const { user } = request;
        if (!user) {
            throw new common_1.ForbiddenException("User not authenticated");
        }
        const member = await this.prisma.messMember.findFirst({
            where: {
                userId: user.id,
                ...(request.messId ? { messId: request.messId } : {}),
                isActive: true,
            },
            orderBy: { joinedDate: "asc" },
            select: { id: true, messId: true, role: true, roles: true },
        });
        if (!member) {
            throw new common_1.ForbiddenException("You are not an active mess member");
        }
        request.messId = member.messId;
        request.memberId = member.id;
        request.memberRole = member.role;
        const rawRoles = member.roles.length ? member.roles : [member.role];
        const userRole = rawRoles.includes("SUPER_ADMIN")
            ? register_dto_1.Role.SUPER_ADMIN
            : rawRoles.includes("ADMIN")
                ? register_dto_1.Role.MANAGER
                : register_dto_1.Role.MEMBER;
        const hasRole = requiredRoles.some((role) => {
            if (userRole === register_dto_1.Role.SUPER_ADMIN)
                return true;
            if (userRole === register_dto_1.Role.MANAGER) {
                return role === register_dto_1.Role.MANAGER || role === register_dto_1.Role.MEMBER;
            }
            return role === register_dto_1.Role.MEMBER;
        });
        if (!hasRole) {
            throw new common_1.ForbiddenException("You do not have permission to access this resource");
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map