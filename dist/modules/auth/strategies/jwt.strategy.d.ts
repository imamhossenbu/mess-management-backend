import { Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../../prisma/prisma.service";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
        role: string;
    }): Promise<{
        userBalance: {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            balance: import("@prisma/client/runtime/library").Decimal;
            lastUpdated: Date;
        };
        name: string;
        email: string;
        phone: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
    }>;
}
export {};
