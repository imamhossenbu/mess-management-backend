import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto";
import { ConfigService } from "@nestjs/config";
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
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
    getProfile(req: any): Promise<{
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
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<any>;
}
