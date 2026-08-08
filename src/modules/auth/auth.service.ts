// src/modules/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto} from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
        role: dto.role || "MEMBER",
        roomNumber: dto.roomNumber,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        roomNumber: true,
      },
    });

    // Create user balance
    await this.prisma.userBalance.create({
      data: {
        userId: user.id,
        balance: 0,
      },
    });

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

    return user;
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    return this.jwtService.sign(payload);
  }
}
