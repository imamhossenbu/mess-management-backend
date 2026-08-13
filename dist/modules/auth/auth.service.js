"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, notificationsService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.notificationsService = notificationsService;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("User already exists with this email");
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                phone: dto.phone || "",
                password: hashedPassword,
                profileImage: null,
                isActive: false,
                approvalStatus: "PENDING",
            },
        });
        const { password, ...userWithoutPassword } = user;
        return {
            message: "Registration submitted. Please wait for super admin approval.",
            user: userWithoutPassword,
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        if (user.approvalStatus === "PENDING") {
            throw new common_1.UnauthorizedException("Your account is waiting for super admin approval");
        }
        if (user.approvalStatus === "REJECTED" || !user.isActive) {
            throw new common_1.UnauthorizedException("Account is inactive");
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const userWithoutPassword = await this.withMessRole(user);
        const token = this.generateToken(user);
        return { accessToken: token, user: userWithoutPassword };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                profileImage: true,
                isActive: true,
                messMembers: {
                    include: {
                        mess: true,
                        userBalance: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        return this.withMessRole(user);
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !(await bcrypt.compare(dto.currentPassword, user.password))) {
            throw new common_1.BadRequestException("Current password is incorrect");
        }
        if (dto.currentPassword === dto.newPassword) {
            throw new common_1.BadRequestException("New password must be different from the current password");
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: await bcrypt.hash(dto.newPassword, 10) },
        });
        return { message: "Password changed successfully" };
    }
    async googleLogin(googleUser) {
        try {
            let user = await this.prisma.user.findUnique({
                where: { email: googleUser.email },
            });
            if (!user) {
                const randomPassword = Math.random().toString(36).slice(-8);
                const hashedPassword = await bcrypt.hash(randomPassword, 10);
                user = await this.prisma.user.create({
                    data: {
                        name: googleUser.name,
                        email: googleUser.email,
                        phone: "",
                        password: hashedPassword,
                        profileImage: googleUser.picture || null,
                        approvalStatus: "APPROVED",
                    },
                });
                const mess = await this.prisma.mess.create({
                    data: {
                        name: `${user.name}'s Mess`,
                        slug: `mess-${Date.now()}`,
                        isActive: true,
                    },
                });
                const member = await this.prisma.messMember.create({
                    data: {
                        userId: user.id,
                        messId: mess.id,
                        role: "SUPER_ADMIN",
                        roles: ["SUPER_ADMIN"],
                        isActive: true,
                    },
                });
                await this.prisma.userBalance.create({
                    data: {
                        memberId: member.id,
                        balance: 0,
                    },
                });
            }
            const token = this.generateToken(user);
            const userWithoutPassword = await this.withMessRole(user);
            return {
                accessToken: token,
                user: userWithoutPassword,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Google login failed");
        }
    }
    generateToken(user) {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload);
    }
    async withMessRole(user) {
        const { password, ...safeUser } = user;
        const membership = await this.prisma.messMember.findFirst({
            where: { userId: user.id, isActive: true },
            orderBy: { joinedDate: "asc" },
            select: { role: true, roles: true },
        });
        const roles = membership?.roles?.length ? membership.roles : membership ? [membership.role] : [];
        return {
            ...safeUser,
            role: roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : roles.includes("ADMIN") ? "MANAGER" : "MEMBER",
            roles: roles.map((role) => role === "ADMIN" ? "MANAGER" : role),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        notifications_service_1.NotificationsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map