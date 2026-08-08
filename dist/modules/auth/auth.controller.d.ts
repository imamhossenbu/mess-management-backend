import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            roomNumber: string;
            profileImage: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string;
            email: string | null;
            role: import(".prisma/client").$Enums.Role;
            roomNumber: string | null;
            profileImage: string | null;
            isActive: boolean;
            joinedDate: Date;
            leftDate: Date | null;
        };
    }>;
    getProfile(req: any): Promise<{
        balance: number;
        balances: any;
        id: string;
        name: string;
        phone: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        roomNumber: string;
        profileImage: string;
        isActive: boolean;
        joinedDate: Date;
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any): Promise<{
        accessToken: string;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string;
            email: string | null;
            role: import(".prisma/client").$Enums.Role;
            roomNumber: string | null;
            profileImage: string | null;
            isActive: boolean;
            joinedDate: Date;
            leftDate: Date | null;
        };
        isNewUser: boolean;
    }>;
}
