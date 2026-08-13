import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto, UpdateProfileDto } from "./dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        profileImage: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
        email: string;
        phone: string;
        profileImage: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
        email: string;
        phone: string;
        profileImage: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        profileImage: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
    uploadProfileImage(req: any, file: any): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        profileImage: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
    removeProfileImage(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        profileImage: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
        email: string;
        phone: string;
        isActive: boolean;
    }>;
    hardDelete(id: string): Promise<{
        message: string;
    }>;
}
