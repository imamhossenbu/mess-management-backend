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
exports.MessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let MessService = class MessService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
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
    async addMember(messId, userId, role = "MEMBER") {
        const mess = await this.findById(messId);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const existing = await this.prisma.messMember.findFirst({
            where: {
                userId,
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
                    role: role,
                },
            });
        }
        const member = await this.prisma.messMember.create({
            data: {
                userId,
                messId,
                role: role,
                isActive: true,
            },
        });
        await this.prisma.userBalance.create({
            data: {
                memberId: member.id,
                balance: 0,
            },
        });
        return member;
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
        return members;
    }
    async updateMemberRole(messId, userId, role) {
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
        if (member.role === client_1.MessRole.SUPER_ADMIN && role !== "SUPER_ADMIN") {
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
                role: role,
            },
        });
    }
};
exports.MessService = MessService;
exports.MessService = MessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], MessService);
//# sourceMappingURL=mess.service.js.map