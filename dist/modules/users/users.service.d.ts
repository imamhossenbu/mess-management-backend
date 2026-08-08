import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto, UpdateUserDto, UpdateProfileDto } from "./dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { NotificationsService } from "../notifications/notifications.service";
export declare class UsersService {
    private prisma;
    private cloudinaryService;
    private notificationsService;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService, notificationsService: NotificationsService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        profileImage: string | null;
        isActive: boolean;
    }>;
    findAll(): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        profileImage: string;
        isActive: boolean;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
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
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        profileImage: string;
        isActive: boolean;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
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
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        profileImage: string;
        isActive: boolean;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
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
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        profileImage: string;
        isActive: boolean;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
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
    updateProfileImage(userId: string, file: any): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        profileImage: string;
        isActive: boolean;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
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
    removeProfileImage(userId: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        profileImage: string;
        isActive: boolean;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
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
    remove(id: string): Promise<{
        email: string;
        id: string;
        name: string;
        phone: string;
        isActive: boolean;
    }>;
    hardDelete(id: string): Promise<{
        message: string;
    }>;
    findByPhone(phone: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        password: string;
        profileImage: string | null;
        isActive: boolean;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        password: string;
        profileImage: string | null;
        isActive: boolean;
    }>;
    updateBalance(userId: string, amount: number): Promise<{
        userId: string;
        balance: number;
    }>;
}
