"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentMember = exports.CurrentMess = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentMess = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.messId;
});
exports.CurrentMember = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return {
        memberId: request.memberId,
        role: request.memberRole,
    };
});
//# sourceMappingURL=current-mess.decorator.js.map