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
                isActive: true,
                approvalStatus: "PENDING",
                role: "MEMBER",
                userBalance: {
                    create: {
                        balance: 0,
                    },
                },
            },
        });
        const { password, ...userWithoutPassword } = user;
        try {
            await this.notificationsService.create({
                userId: user.id,
                type: "SYSTEM",
                title: "Welcome to Mess Management",
                message: `Welcome ${user.name}! Your account has been created successfully.`,
                link: "/dashboard",
            });
        }
        catch (error) {
            console.error("Failed to send welcome notification:", error);
        }
        return {
            message: "Account created successfully!",
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
            throw new common_1.UnauthorizedException("Your account is waiting for approval");
        }
        if (user.approvalStatus === "REJECTED" || !user.isActive) {
            throw new common_1.UnauthorizedException("Account is inactive");
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const token = this.generateToken(user);
        const userWithoutPassword = this.excludePassword(user);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { updatedAt: new Date() },
        });
        return {
            accessToken: token,
            user: userWithoutPassword,
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                userBalance: true,
                meals: {
                    take: 5,
                    orderBy: { date: "desc" },
                },
                payments: {
                    take: 5,
                    orderBy: { paymentDate: "desc" },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        return this.excludePassword(user);
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException("User not found");
        }
        const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException("Current password is incorrect");
        }
        if (dto.currentPassword === dto.newPassword) {
            throw new common_1.BadRequestException("New password must be different from the current password");
        }
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        try {
            await this.notificationsService.create({
                userId: user.id,
                type: "SYSTEM",
                title: "Password Changed",
                message: "Your password has been changed successfully.",
                link: "/profile",
            });
        }
        catch (error) {
            console.error("Failed to send password change notification:", error);
        }
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
                        isActive: true,
                        role: "MEMBER",
                        userBalance: {
                            create: {
                                balance: 0,
                            },
                        },
                    },
                });
            }
            const token = this.generateToken(user);
            const userWithoutPassword = this.excludePassword(user);
            return {
                accessToken: token,
                user: userWithoutPassword,
            };
        }
        catch (error) {
            console.error("Google login error:", error);
            throw new common_1.UnauthorizedException("Google login failed");
        }
    }
    generateToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }
    excludePassword(user) {
        const { password, ...safeUser } = user;
        return safeUser;
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