import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { RegisterDto, LoginDto, ChangePasswordDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class AuthService {
    private prisma;
    private jwtService;
    private notificationsService;
    constructor(prisma: PrismaService, jwtService: JwtService, notificationsService: NotificationsService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            profileImage: string | null;
            isActive: boolean;
            approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
            joinedDate: Date;
            leftDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: any;
    }>;
    getProfile(userId: string): Promise<any>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    googleLogin(googleUser: any): Promise<{
        accessToken: string;
        user: any;
    }>;
    private generateToken;
    private excludePassword;
}
