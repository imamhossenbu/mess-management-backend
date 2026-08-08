import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { RegisterDto, LoginDto } from "./dto";
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    getProfile(userId: string): Promise<{
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
    googleLogin(googleUser: any): Promise<{
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
        isNewUser: boolean;
    }>;
    private generateToken;
}
