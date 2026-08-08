import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { RegisterDto, LoginDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class AuthService {
    private prisma;
    private jwtService;
    private notificationsService;
    constructor(prisma: PrismaService, jwtService: JwtService, notificationsService: NotificationsService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
            profileImage: string | null;
            isActive: boolean;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
            profileImage: string | null;
            isActive: boolean;
        };
    }>;
    getProfile(userId: string): Promise<{
        email: string;
        id: string;
        name: string;
        phone: string;
        profileImage: string;
        isActive: boolean;
        messMembers: ({
            mess: {
                description: string | null;
                email: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                phone: string | null;
                isActive: boolean;
                slug: string;
                address: string | null;
                logo: string | null;
                city: string | null;
                country: string | null;
                maxMembers: number;
            };
            userBalance: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                balance: import("@prisma/client/runtime/library").Decimal;
                lastUpdated: Date;
                memberId: string;
            };
        } & {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
        })[];
    }>;
    googleLogin(googleUser: any): Promise<{
        accessToken: string;
        user: {
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
            profileImage: string | null;
            isActive: boolean;
        };
    }>;
    private generateToken;
}
