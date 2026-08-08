import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            name: string;
            phone: string;
            email: string;
            roomNumber: string;
            role: import(".prisma/client").$Enums.Role;
            id: string;
            profileImage: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            name: string;
            phone: string;
            email: string | null;
            roomNumber: string | null;
            role: import(".prisma/client").$Enums.Role;
            id: string;
            profileImage: string | null;
            isActive: boolean;
            joinedDate: Date;
            leftDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getProfile(req: any): Promise<{
        balance: number;
        balances: any;
        name: string;
        phone: string;
        email: string;
        roomNumber: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        profileImage: string;
        isActive: boolean;
        joinedDate: Date;
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any): Promise<{
        accessToken: string;
        user: {
            name: string;
            phone: string;
            email: string | null;
            roomNumber: string | null;
            role: import(".prisma/client").$Enums.Role;
            id: string;
            profileImage: string | null;
            isActive: boolean;
            joinedDate: Date;
            leftDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        isNewUser: boolean;
    }>;
}
