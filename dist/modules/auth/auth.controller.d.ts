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
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            phone: string;
            email: string | null;
            role: import(".prisma/client").$Enums.Role;
            roomNumber: string | null;
            profileImage: string | null;
            isActive: boolean;
            joinedDate: Date;
            leftDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getProfile(req: any): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        roomNumber: string;
        isActive: boolean;
        joinedDate: Date;
        balances: {
            balance: import("@prisma/client/runtime/library").Decimal;
        };
    }>;
}
