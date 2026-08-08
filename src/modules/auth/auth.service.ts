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
import { NotificationsService } from "../notifications/notifications.service"; // ✅ Import

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService, // ✅ Inject
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ phone: dto.phone }, { email: dto.email }],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        "User already exists with this phone or email",
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        password: hashedPassword,
        role: dto.role || Role.MEMBER,
        roomNumber: dto.roomNumber,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        roomNumber: true,
        profileImage: true,
      },
    });

    // Create user balance
    await this.prisma.userBalance.create({
      data: {
        userId: user.id,
        balance: 0,
      },
    });

    // ✅ Send welcome notification to new user
    await this.notificationsService.create({
      userId: user.id,
      type: "SYSTEM",
      title: "Welcome to Mess Management System",
      message: `Hello ${user.name}, welcome to the mess management system. Your account has been successfully created with role: ${user.role}`,
      link: "/profile",
    });

    // ✅ Send notification to all admins about new user
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "MANAGER"] },
        isActive: true,
      },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "SYSTEM",
        title: "New User Registered",
        message: `${user.name} has registered as ${user.role}`,
        link: `/users/${user.id}`,
      });
    }

    // Generate token
    const token = this.generateToken(user);

    return { accessToken: token, user };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
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

    // ✅ Send login notification
    await this.notificationsService.create({
      userId: user.id,
      type: "SYSTEM",
      title: "Login Notification",
      message: `You have successfully logged in at ${new Date().toLocaleString()}`,
      link: "/profile",
    });

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
        phone: true,
        email: true,
        role: true,
        roomNumber: true,
        profileImage: true,
        isActive: true,
        joinedDate: true,
        balances: {
          select: {
            balance: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return {
      ...user,
      balance: user.balances?.[0]?.balance
        ? Number(user.balances[0].balance)
        : 0,
      balances: undefined,
    };
  }

  async googleLogin(googleUser: any) {
    try {
      // Check if user exists with email
      let user = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      let isNewUser = false;

      if (!user) {
        isNewUser = true;
        // Create new user with random password
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        user = await this.prisma.user.create({
          data: {
            name: googleUser.name,
            email: googleUser.email,
            phone: "", // Google provides no phone, will be updated later
            password: hashedPassword,
            role: Role.MEMBER,
            profileImage: googleUser.picture || null,
          },
        });

        // Create user balance
        await this.prisma.userBalance.create({
          data: {
            userId: user.id,
            balance: 0,
          },
        });

        // ✅ Send welcome notification for Google login
        await this.notificationsService.create({
          userId: user.id,
          type: "SYSTEM",
          title: "Welcome! Google Login",
          message: `Hello ${user.name}, welcome to the mess management system. You have signed in with Google.`,
          link: "/profile",
        });

        // ✅ Notify admins about new Google user
        const admins = await this.prisma.user.findMany({
          where: {
            role: { in: ["SUPER_ADMIN", "MANAGER"] },
            isActive: true,
          },
        });

        for (const admin of admins) {
          await this.notificationsService.create({
            userId: admin.id,
            type: "SYSTEM",
            title: "New Google User Registered",
            message: `${user.name} has registered via Google`,
            link: `/users/${user.id}`,
          });
        }
      } else {
        // ✅ Send Google login notification for existing user
        await this.notificationsService.create({
          userId: user.id,
          type: "SYSTEM",
          title: "Google Login Notification",
          message: `You have successfully logged in via Google at ${new Date().toLocaleString()}`,
          link: "/profile",
        });
      }

      // Generate token
      const token = this.generateToken(user);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return {
        accessToken: token,
        user: userWithoutPassword,
        isNewUser,
      };
    } catch (error) {
      throw new UnauthorizedException("Google login failed");
    }
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    return this.jwtService.sign(payload);
  }
}
