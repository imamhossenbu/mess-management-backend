import { PrismaService } from "../../prisma/prisma.service";
import { CreateMessDto, UpdateMessDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
export declare class MessService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(userId: string, createMessDto: CreateMessDto): Promise<{
        description: string | null;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        isActive: boolean;
        slug: string;
        address: string | null;
        logo: string | null;
        city: string | null;
        country: string | null;
        maxMembers: number;
    }>;
    getUserMesses(userId: string): Promise<{
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
    findOne(messId: string): Promise<{
        members: ({
            user: {
                email: string;
                id: string;
                name: string;
                phone: string;
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
    } & {
        description: string | null;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        isActive: boolean;
        slug: string;
        address: string | null;
        logo: string | null;
        city: string | null;
        country: string | null;
        maxMembers: number;
    }>;
    findById(messId: string): Promise<{
        description: string | null;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        isActive: boolean;
        slug: string;
        address: string | null;
        logo: string | null;
        city: string | null;
        country: string | null;
        maxMembers: number;
    }>;
    update(messId: string, updateMessDto: UpdateMessDto): Promise<{
        description: string | null;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        isActive: boolean;
        slug: string;
        address: string | null;
        logo: string | null;
        city: string | null;
        country: string | null;
        maxMembers: number;
    }>;
    remove(messId: string): Promise<{
        message: string;
    }>;
    addMember(messId: string, userId: string, role?: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        messId: string;
        role: import(".prisma/client").$Enums.MessRole;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    removeMember(messId: string, userId: string): Promise<{
        message: string;
    }>;
    getMembers(messId: string): Promise<({
        user: {
            email: string;
            id: string;
            name: string;
            phone: string;
            profileImage: string;
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
    })[]>;
    updateMemberRole(messId: string, userId: string, role: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        messId: string;
        role: import(".prisma/client").$Enums.MessRole;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
}
