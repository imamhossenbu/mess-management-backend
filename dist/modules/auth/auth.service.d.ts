import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
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
    private generateToken;
}
