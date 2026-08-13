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
        id: string;
        name: string;
        phone: string | null;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        profileImage: string | null;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        profileImage: string;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        })[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        profileImage: string;
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
                memberId: string;
                balance: import("@prisma/client/runtime/library").Decimal;
                lastUpdated: Date;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        })[];
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        profileImage: string;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        })[];
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        profileImage: string;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        })[];
    }>;
    updateProfileImage(userId: string, file: any): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        profileImage: string;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        })[];
    }>;
    removeProfileImage(userId: string): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        profileImage: string;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            roles: import(".prisma/client").$Enums.MessRole[];
            joinedDate: Date;
            leftDate: Date | null;
        })[];
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        isActive: boolean;
    }>;
    hardDelete(id: string): Promise<{
        message: string;
    }>;
    findByPhone(phone: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        profileImage: string | null;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        profileImage: string | null;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
    }>;
    updateBalance(userId: string, amount: number): Promise<{
        userId: string;
        balance: number;
    }>;
}
