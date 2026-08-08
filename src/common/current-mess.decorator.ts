// src/common/decorators/current-mess.decorator.ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentMess = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.messId;
  },
);

export const CurrentMember = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      memberId: request.memberId,
      role: request.memberRole,
    };
  },
);
