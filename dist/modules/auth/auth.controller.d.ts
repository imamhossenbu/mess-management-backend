import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, ChangePasswordDto } from "./dto";
import { ConfigService } from "@nestjs/config";
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            profileImage: string | null;
            isActive: boolean;
            approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
            joinedDate: Date;
            leftDate: Date | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: any;
    }>;
    getProfile(req: any): Promise<any>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<any>;
}
