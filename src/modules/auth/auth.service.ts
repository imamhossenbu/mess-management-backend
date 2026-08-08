// src/modules/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { RegisterDto, LoginDto } from "./dto";
import { Role } from "./dto/register.dto";
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

    // ✅ Create user
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone || "",
        password: hashedPassword,
        profileImage: null,
        isActive: true,
      },
    });

    // ✅ Create default mess
    const mess = await this.prisma.mess.create({
      data: {
        name: `${user.name}'s Mess`,
        slug: `mess-${Date.now()}`,
        description: "My mess",
        isActive: true,
      },
    });

    // ✅ Create mess member (SUPER_ADMIN)
    const member = await this.prisma.messMember.create({
      data: {
        userId: user.id,
        messId: mess.id,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });

    // ✅ Create user balance - memberId ব্যবহার করুন
    await this.prisma.userBalance.create({
      data: {
        memberId: member.id, // ✅ userId না, memberId ব্যবহার করুন
        balance: 0,
      },
    });

    // ✅ Send welcome notification
    await this.notificationsService.create({
      userId: user.id,
      type: "SYSTEM",
      title: "Welcome to the Mess!",
      message: `Hello ${user.name}, your account has been created successfully. Your mess "${mess.name}" has been created.`,
      link: "/profile",
    });

    // Generate token
    const token = this.generateToken(user);

    const { password, ...userWithoutPassword } = user;

    return { accessToken: token, user: userWithoutPassword };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Account is inactive");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const { password, ...userWithoutPassword } = user;
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

    return user;
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
      const { password, ...userWithoutPassword } = user;

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
}
