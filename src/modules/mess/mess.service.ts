// src/modules/mess/mess.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateMessDto, UpdateMessDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
import { EmailService } from "../notifications/email.service";
import { AddMemberDto } from "./dto";
import * as bcrypt from "bcrypt";
import { MessRole } from "@prisma/client";

@Injectable()
export class MessService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
  ) {}

  // ==================== CREATE ====================

  async create(userId: string, createMessDto: CreateMessDto) {
    const { name, description, address, phone, email } = createMessDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
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
      throw new BadRequestException("You already have a mess with this name");
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

    // ✅ Use enum value directly
    const member = await this.prisma.messMember.create({
      data: {
        userId,
        messId: mess.id,
        role: MessRole.SUPER_ADMIN, // ✅ Direct enum
        roles: [MessRole.SUPER_ADMIN],
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

  // ==================== FIND ====================

  async getUserMesses(userId: string) {
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

  async findOne(messId: string) {
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
      throw new NotFoundException("Mess not found");
    }

    return mess;
  }

  async findById(messId: string) {
    const mess = await this.prisma.mess.findUnique({
      where: { id: messId },
    });

    if (!mess) {
      throw new NotFoundException("Mess not found");
    }

    return mess;
  }

  // ==================== UPDATE ====================

  async update(messId: string, updateMessDto: UpdateMessDto) {
    const mess = await this.findById(messId);

    let data: any = { ...updateMessDto };
    if (updateMessDto.name) {
      data.slug = `${updateMessDto.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    }

    const updated = await this.prisma.mess.update({
      where: { id: messId },
      data,
    });

    return updated;
  }

  // ==================== DELETE ====================

  async remove(messId: string) {
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

  // ==================== MEMBERS ====================

  async addMember(messId: string, dto: AddMemberDto) {
    const mess = await this.findById(messId);
    const roles = this.normalizeRoles(dto.roles ?? (dto.role ? [dto.role] : ["MEMBER"]));
    const user = dto.userId
      ? await this.prisma.user.findUnique({ where: { id: dto.userId } })
      : await this.createInvitedUser(dto);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const existing = await this.prisma.messMember.findFirst({
      where: {
        userId: user.id,
        messId,
      },
    });

    if (existing) {
      if (existing.isActive) {
        throw new BadRequestException("User is already a member of this mess");
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

  private async createInvitedUser(dto: AddMemberDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException("User already exists with this email");
    return this.prisma.user.create({
      data: {
        name: dto.name!, email: dto.email!, phone: dto.phone || "",
        password: await bcrypt.hash(dto.password!, 10), isActive: true, approvalStatus: "APPROVED",
      },
    });
  }

  private normalizeRoles(roles: string[]): MessRole[] {
    const uniqueRoles = [...new Set(roles)] as MessRole[];
    return uniqueRoles.length ? uniqueRoles : [MessRole.MEMBER];
  }

  private primaryRole(roles: MessRole[]): MessRole {
    return roles.includes(MessRole.SUPER_ADMIN) ? MessRole.SUPER_ADMIN : roles.includes(MessRole.ADMIN) ? MessRole.ADMIN : MessRole.MEMBER;
  }

  async removeMember(messId: string, userId: string) {
    const member = await this.prisma.messMember.findFirst({
      where: {
        userId,
        messId,
        isActive: true,
      },
    });

    if (!member) {
      throw new NotFoundException("Member not found");
    }

    if (member.role === MessRole.SUPER_ADMIN) {
      const otherAdmins = await this.prisma.messMember.count({
        where: {
          messId,
          role: MessRole.SUPER_ADMIN,
          isActive: true,
          NOT: { id: member.id },
        },
      });

      if (otherAdmins === 0) {
        throw new BadRequestException(
          "Cannot remove the only SUPER_ADMIN. Transfer ownership first.",
        );
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

  async getMembers(messId: string) {
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

  async updateMemberRole(messId: string, userId: string, role: string, requestedRoles?: string[]) {
    const member = await this.prisma.messMember.findFirst({
      where: {
        userId,
        messId,
        isActive: true,
      },
    });

    if (!member) {
      throw new NotFoundException("Member not found");
    }

    const roles = this.normalizeRoles(requestedRoles ?? [role]);
    if (member.roles.includes(MessRole.SUPER_ADMIN) && !roles.includes(MessRole.SUPER_ADMIN)) {
      const otherAdmins = await this.prisma.messMember.count({
        where: {
          messId,
          role: MessRole.SUPER_ADMIN,
          isActive: true,
          NOT: { id: member.id },
        },
      });

      if (otherAdmins === 0) {
        throw new BadRequestException(
          "Cannot change role of the only SUPER_ADMIN. Transfer ownership first.",
        );
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
}
