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
exports.MessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const email_service_1 = require("../notifications/email.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
let MessService = class MessService {
    constructor(prisma, notificationsService, emailService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.emailService = emailService;
    }
    async create(userId, createMessDto) {
        const { name, description, address, phone, email } = createMessDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const existingMess = await this.prisma.mess.findFirst({
            where: {
                name,
                members: {
                    some: {
                        userId,
                    },
                },
            },
        });
        if (existingMess) {
            throw new common_1.BadRequestException("You already have a mess with this name");
        }
        const slug = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
        const mess = await this.prisma.mess.create({
            data: {
                name,
                slug,
                description,
                address,
                phone,
                email,
                isActive: true,
            },
        });
        const member = await this.prisma.messMember.create({
            data: {
                userId,
                messId: mess.id,
                role: client_1.MessRole.SUPER_ADMIN,
                roles: [client_1.MessRole.SUPER_ADMIN],
                isActive: true,
            },
        });
        await this.prisma.userBalance.create({
            data: {
                memberId: member.id,
                balance: 0,
            },
        });
        await this.notificationsService.create({
            userId,
            type: "SYSTEM",
            title: "Mess Created Successfully",
            message: `Your mess "${mess.name}" has been created. You are the SUPER_ADMIN.`,
            link: `/dashboard`,
        });
        return mess;
    }
    async getUserMesses(userId) {
        const members = await this.prisma.messMember.findMany({
            where: {
                userId,
                isActive: true,
            },
            include: {
                mess: true,
            },
            orderBy: {
                mess: {
                    name: "asc",
                },
            },
        });
        return members.map((member) => ({
            id: member.mess.id,
            name: member.mess.name,
            slug: member.mess.slug,
            logo: member.mess.logo,
            description: member.mess.description,
            address: member.mess.address,
            phone: member.mess.phone,
            email: member.mess.email,
            role: member.role,
            roles: member.roles,
        }));
    }
    async findOne(messId) {
        const mess = await this.prisma.mess.findUnique({
            where: { id: messId },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
        if (!mess) {
            throw new common_1.NotFoundException("Mess not found");
        }
        return mess;
    }
    async findById(messId) {
        const mess = await this.prisma.mess.findUnique({
            where: { id: messId },
        });
        if (!mess) {
            throw new common_1.NotFoundException("Mess not found");
        }
        return mess;
    }
    async update(messId, updateMessDto) {
        const mess = await this.findById(messId);
        let data = { ...updateMessDto };
        if (updateMessDto.name) {
            data.slug = `${updateMessDto.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
        }
        const updated = await this.prisma.mess.update({
            where: { id: messId },
            data,
        });
        return updated;
    }
    async remove(messId) {
        const mess = await this.findById(messId);
        await this.prisma.mess.update({
            where: { id: messId },
            data: {
                isActive: false,
            },
        });
        await this.prisma.messMember.updateMany({
            where: { messId },
            data: {
                isActive: false,
                leftDate: new Date(),
            },
        });
        return { message: `Mess "${mess.name}" deleted successfully` };
    }
    async addMember(messId, dto) {
        const mess = await this.findById(messId);
        const roles = this.normalizeRoles(dto.roles ?? (dto.role ? [dto.role] : ["MEMBER"]));
        const user = dto.userId
            ? await this.prisma.user.findUnique({ where: { id: dto.userId } })
            : await this.createInvitedUser(dto);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const existing = await this.prisma.messMember.findFirst({
            where: {
                userId: user.id,
                messId,
            },
        });
        if (existing) {
            if (existing.isActive) {
                throw new common_1.BadRequestException("User is already a member of this mess");
            }
            return this.prisma.messMember.update({
                where: { id: existing.id },
                data: {
                    isActive: true,
                    leftDate: null,
                    role: this.primaryRole(roles),
                    roles,
                },
            });
        }
        const member = await this.prisma.messMember.create({
            data: {
                userId: user.id,
                messId,
                role: this.primaryRole(roles),
                roles,
                isActive: true,
            },
        });
        await this.prisma.userBalance.create({
            data: {
                memberId: member.id,
                balance: 0,
            },
        });
        await this.prisma.user.update({ where: { id: user.id }, data: { isActive: true, approvalStatus: "APPROVED" } });
        if (!dto.userId && dto.password) {
            await this.emailService.sendCredentials(user, dto.password, mess.name);
        }
        return member;
    }
    async getPendingRegistrations() {
        return this.prisma.user.findMany({
            where: { approvalStatus: "PENDING" },
            select: { id: true, name: true, email: true, phone: true, createdAt: true },
            orderBy: { createdAt: "asc" },
        });
    }
    async createInvitedUser(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.BadRequestException("User already exists with this email");
        return this.prisma.user.create({
            data: {
                name: dto.name, email: dto.email, phone: dto.phone || "",
                password: await bcrypt.hash(dto.password, 10), isActive: true, approvalStatus: "APPROVED",
            },
        });
    }
    normalizeRoles(roles) {
        const uniqueRoles = [...new Set(roles)];
        return uniqueRoles.length ? uniqueRoles : [client_1.MessRole.MEMBER];
    }
    primaryRole(roles) {
        return roles.includes(client_1.MessRole.SUPER_ADMIN) ? client_1.MessRole.SUPER_ADMIN : roles.includes(client_1.MessRole.ADMIN) ? client_1.MessRole.ADMIN : client_1.MessRole.MEMBER;
    }
    async removeMember(messId, userId) {
        const member = await this.prisma.messMember.findFirst({
            where: {
                userId,
                messId,
                isActive: true,
            },
        });
        if (!member) {
            throw new common_1.NotFoundException("Member not found");
        }
        if (member.role === client_1.MessRole.SUPER_ADMIN) {
            const otherAdmins = await this.prisma.messMember.count({
                where: {
                    messId,
                    role: client_1.MessRole.SUPER_ADMIN,
                    isActive: true,
                    NOT: { id: member.id },
                },
            });
            if (otherAdmins === 0) {
                throw new common_1.BadRequestException("Cannot remove the only SUPER_ADMIN. Transfer ownership first.");
            }
        }
        await this.prisma.messMember.update({
            where: { id: member.id },
            data: {
                isActive: false,
                leftDate: new Date(),
            },
        });
        return { message: "Member removed successfully" };
    }
    async getMembers(messId) {
        const mess = await this.findById(messId);
        const members = await this.prisma.messMember.findMany({
            where: {
                messId,
                isActive: true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        profileImage: true,
                    },
                },
                userBalance: true,
            },
            orderBy: {
                user: {
                    name: "asc",
                },
            },
        });
        return members.map((member) => ({
            id: member.id,
            userId: member.userId,
            userName: member.user.name,
            userEmail: member.user.email,
            userPhone: member.user.phone,
            userProfileImage: member.user.profileImage,
            role: member.role,
            roles: member.roles,
            joinedDate: member.joinedDate,
            balance: Number(member.userBalance?.balance ?? 0),
        }));
    }
    async updateMemberRole(messId, userId, role, requestedRoles) {
        const member = await this.prisma.messMember.findFirst({
            where: {
                userId,
                messId,
                isActive: true,
            },
        });
        if (!member) {
            throw new common_1.NotFoundException("Member not found");
        }
        const roles = this.normalizeRoles(requestedRoles ?? [role]);
        if (member.roles.includes(client_1.MessRole.SUPER_ADMIN) && !roles.includes(client_1.MessRole.SUPER_ADMIN)) {
            const otherAdmins = await this.prisma.messMember.count({
                where: {
                    messId,
                    role: client_1.MessRole.SUPER_ADMIN,
                    isActive: true,
                    NOT: { id: member.id },
                },
            });
            if (otherAdmins === 0) {
                throw new common_1.BadRequestException("Cannot change role of the only SUPER_ADMIN. Transfer ownership first.");
            }
        }
        return this.prisma.messMember.update({
            where: { id: member.id },
            data: {
                role: this.primaryRole(roles),
                roles,
            },
        });
    }
};
exports.MessService = MessService;
exports.MessService = MessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        email_service_1.EmailService])
], MessService);
//# sourceMappingURL=mess.service.js.map