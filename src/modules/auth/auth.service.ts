// src/modules/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { RegisterDto, LoginDto, ChangePasswordDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException("User already exists with this email");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Public registration creates a pending account. A super admin must
    // approve it and attach it to the mess before the user can sign in.
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

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.approvalStatus === "PENDING") {
      throw new UnauthorizedException("Your account is waiting for super admin approval");
    }
    if (user.approvalStatus === "REJECTED" || !user.isActive) {
      throw new UnauthorizedException("Account is inactive");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const userWithoutPassword = await this.withMessRole(user);
    const token = this.generateToken(user);

    return { accessToken: token, user: userWithoutPassword };
  }

  async getProfile(userId: string) {
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
      throw new UnauthorizedException("User not found");
    }

    return this.withMessRole(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new BadRequestException("Current password is incorrect");
    }
    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException("New password must be different from the current password");
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: await bcrypt.hash(dto.newPassword, 10) },
    });
    return { message: "Password changed successfully" };
  }

  async googleLogin(googleUser: any) {
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

        // Create default mess
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
    } catch (error) {
      throw new UnauthorizedException("Google login failed");
    }
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  private async withMessRole(user: any) {
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
}
