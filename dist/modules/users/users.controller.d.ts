import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto, UpdateProfileDto } from "./dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
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
    uploadProfileImage(req: any, file: any): Promise<{
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
    removeProfileImage(req: any): Promise<{
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
}
