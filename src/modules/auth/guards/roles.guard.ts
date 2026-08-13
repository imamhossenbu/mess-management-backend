// src/modules/auth/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../dto/register.dto";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    // Middleware runs before JWT guards, so membership must be resolved here,
    // after JwtAuthGuard has attached the authenticated user to the request.
    const member = await this.prisma.messMember.findFirst({
      where: {
        userId: user.id,
        ...(request.messId ? { messId: request.messId } : {}),
        isActive: true,
      },
      orderBy: { joinedDate: "asc" },
      select: { id: true, messId: true, role: true },
    });

    if (!member) {
      throw new ForbiddenException("You are not an active mess member");
    }

    request.messId = member.messId;
    request.memberId = member.id;
    request.memberRole = member.role;
    const rawRole = member.role;

    // Map database enum MessRole (SUPER_ADMIN, ADMIN, MEMBER) to controller DTO Role (SUPER_ADMIN, MANAGER, MEMBER)
    let userRole = Role.MEMBER;
    if (rawRole === "SUPER_ADMIN") {
      userRole = Role.SUPER_ADMIN;
    } else if (rawRole === "ADMIN") {
      userRole = Role.MANAGER; // ADMIN in database maps to MANAGER in controller routes
    }

    // Check role hierarchy permissions
    const hasRole = requiredRoles.some((role) => {
      if (userRole === Role.SUPER_ADMIN) return true; // Super admin has access to all routes
      if (userRole === Role.MANAGER) {
        return role === Role.MANAGER || role === Role.MEMBER;
      }
      return role === Role.MEMBER;
    });

    if (!hasRole) {
      throw new ForbiddenException(
        "You do not have permission to access this resource",
      );
    }

    return true;
  }
}
