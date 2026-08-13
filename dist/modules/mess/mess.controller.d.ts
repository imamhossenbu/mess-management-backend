import { MessService } from "./mess.service";
import { CreateMessDto, UpdateMessDto, AddMemberDto, UpdateRoleDto } from "./dto";
export declare class MessController {
    private readonly messService;
    constructor(messService: MessService);
    create(req: any, createMessDto: CreateMessDto): Promise<void>;
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
            userId: string;
            messId: string;
            role: import(".prisma/client").$Enums.MessRole;
            joinedDate: Date;
            leftDate: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
    }>;
    update(id: string, updateMessDto: UpdateMessDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
    }>;
    remove(id: string): Promise<void>;
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
        userId: string;
        messId: string;
        role: import(".prisma/client").$Enums.MessRole;
        joinedDate: Date;
        leftDate: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    addMember(id: string, addMemberDto: AddMemberDto): Promise<{
        id: string;
        userId: string;
        messId: string;
        role: import(".prisma/client").$Enums.MessRole;
        joinedDate: Date;
        leftDate: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeMember(id: string, userId: string): Promise<{
        message: string;
    }>;
    updateMemberRole(id: string, userId: string, updateRoleDto: UpdateRoleDto): Promise<{
        id: string;
        userId: string;
        messId: string;
        role: import(".prisma/client").$Enums.MessRole;
        joinedDate: Date;
        leftDate: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
