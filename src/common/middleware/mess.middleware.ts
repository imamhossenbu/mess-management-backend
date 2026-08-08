// src/common/middleware/mess.middleware.ts
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class MessMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const path = req.path;
    const method = req.method;

    // ✅ Skip ALL auth routes (login, register, google, etc.)
    if (path.startsWith("/auth")) {
      return next();
    }

    // ✅ Skip health routes
    if (path.startsWith("/health")) {
      return next();
    }

    // ✅ Skip mess creation (POST /mess)
    if (path === "/mess" && method === "POST") {
      return next();
    }

    // ✅ Skip getting user messes (GET /mess/user/messes)
    if (path === "/mess/user/messes" && method === "GET") {
      return next();
    }

    // ✅ For all other routes, check messId
    const messId = req.headers["x-mess-id"] as string;

    if (!messId) {
      throw new BadRequestException(
        "Mess ID is required. Please select a mess.",
      );
    }

    const user = (req as any).user;

    if (!user) {
      throw new UnauthorizedException("User not authenticated");
    }

    const member = await this.prisma.messMember.findFirst({
      where: {
        userId: user.id,
        messId: messId,
        isActive: true,
      },
    });

    if (!member) {
      throw new BadRequestException("You are not a member of this mess");
    }

    (req as any).messId = messId;
    (req as any).memberId = member.id;
    (req as any).memberRole = member.role;

    next();
  }
}
