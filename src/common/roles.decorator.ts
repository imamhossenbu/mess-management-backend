// src/common/decorators/roles.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { Role } from "../modules/auth/dto";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
