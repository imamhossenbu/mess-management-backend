import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto, UpdateProfileDto } from "./dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        email: string;
        profileImage: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        email: string;
        profileImage: string;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        email: string;
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
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        email: string;
        profileImage: string;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        email: string;
        profileImage: string;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    uploadProfileImage(req: any, file: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        email: string;
        profileImage: string;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    removeProfileImage(req: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        email: string;
        profileImage: string;
        messMembers: ({
            mess: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        phone: string;
        email: string;
    }>;
    hardDelete(id: string): Promise<{
        message: string;
    }>;
}
