// src/modules/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        profileImage: true,
        isActive: true,
        approvalStatus: true,
        userBalance: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (!user.isActive || user.approvalStatus === "REJECTED") {
      throw new UnauthorizedException("User is inactive");
    }

    if (user.approvalStatus === "PENDING") {
      throw new UnauthorizedException("Account pending approval");
    }

    return user;
  }
}
