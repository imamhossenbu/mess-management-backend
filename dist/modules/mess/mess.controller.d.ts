import { MessService } from "./mess.service";
import { CreateMessDto, UpdateMessDto, AddMemberDto, UpdateRoleDto } from "./dto";
export declare class MessController {
    private readonly messService;
    constructor(messService: MessService);
    create(req: any, createMessDto: CreateMessDto): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        address: string | null;
        phone: string | null;
        email: string | null;
        logo: string | null;
        city: string | null;
        country: string | null;
        maxMembers: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserMesses(req: any): Promise<{
        id: string;
        name: string;
        slug: string;
        logo: string;
        description: string;
        address: string;
        phone: string;
        email: string;
        role: import(".prisma/client").$Enums.MessRole;
    }[]>;
    findOne(id: string): Promise<{
        members: ({
            user: {
                id: string;
                name: string;
                phone: string;
                email: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
        })[];
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        address: string | null;
        phone: string | null;
        email: string | null;
        logo: string | null;
        city: string | null;
        country: string | null;
        maxMembers: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateMessDto: UpdateMessDto): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        address: string | null;
        phone: string | null;
        email: string | null;
        logo: string | null;
        city: string | null;
        country: string | null;
        maxMembers: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getMembers(id: string): Promise<({
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
            profileImage: string;
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
        joinedDate: Date;
        leftDate: Date | null;
    })[]>;
    addMember(id: string, addMemberDto: AddMemberDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        messId: string;
        role: import(".prisma/client").$Enums.MessRole;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    removeMember(id: string, userId: string): Promise<{
        message: string;
    }>;
    updateMemberRole(id: string, userId: string, updateRoleDto: UpdateRoleDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        messId: string;
        role: import(".prisma/client").$Enums.MessRole;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
}
