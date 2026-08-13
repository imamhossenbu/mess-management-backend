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

    // Create user with default MEMBER role
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone || "",
        password: hashedPassword,
        profileImage: null,
        isActive: true,
        approvalStatus: "APPROVED",
        role: "MEMBER", // Default role
        userBalance: {
          create: {
            balance: 0,
          },
        },
      },
    });

    const { password, ...userWithoutPassword } = user;

    // Send welcome notification
    try {
      await this.notificationsService.create({
        userId: user.id,
        type: "SYSTEM",
        title: "Welcome to Mess Management",
        message: `Welcome ${user.name}! Your account has been created successfully.`,
        link: "/dashboard",
      });
    } catch (error) {
      console.error("Failed to send welcome notification:", error);
    }

    return {
      message: "Account created successfully!",
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
      throw new UnauthorizedException("Your account is waiting for approval");
    }
    if (user.approvalStatus === "REJECTED" || !user.isActive) {
      throw new UnauthorizedException("Account is inactive");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = this.generateToken(user);
    const userWithoutPassword = this.excludePassword(user);

    // Update last login (optional)
    await this.prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() },
    });

    return {
      accessToken: token,
      user: userWithoutPassword,
    };
  }

  async getProfile(userId: string) {
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
      throw new UnauthorizedException("User not found");
    }

    return this.excludePassword(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException("Current password is incorrect");
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        "New password must be different from the current password",
      );
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Send notification
    try {
      await this.notificationsService.create({
        userId: user.id,
        type: "SYSTEM",
        title: "Password Changed",
        message: "Your password has been changed successfully.",
        link: "/profile",
      });
    } catch (error) {
      console.error("Failed to send password change notification:", error);
    }

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
    } catch (error) {
      console.error("Google login error:", error);
      throw new UnauthorizedException("Google login failed");
    }
  }

  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private excludePassword(user: any) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
