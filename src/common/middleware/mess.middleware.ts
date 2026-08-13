// src/common/middleware/mess.middleware.ts
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
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
      return next();
    }

    const mess = await this.prisma.mess.findUnique({
      where: { id: messId },
      select: { id: true, isActive: true },
    });

    if (!mess || !mess.isActive) {
      throw new BadRequestException("Selected mess is unavailable");
    }

    (req as any).messId = messId;

    next();
  }
}
