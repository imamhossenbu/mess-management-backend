import { PrismaService } from "../../prisma/prisma.service";
import { CreateMessDto, UpdateMessDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
import { EmailService } from "../notifications/email.service";
import { AddMemberDto } from "./dto";
export declare class MessService {
    private prisma;
    private notificationsService;
    private emailService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, emailService: EmailService);
    create(userId: string, createMessDto: CreateMessDto): Promise<{
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
        roles: import(".prisma/client").$Enums.MessRole[];
    }[]>;
    findOne(messId: string): Promise<{
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
            roles: import(".prisma/client").$Enums.MessRole[];
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
    findById(messId: string): Promise<{
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
    update(messId: string, updateMessDto: UpdateMessDto): Promise<{
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
    remove(messId: string): Promise<{
        message: string;
    }>;
    addMember(messId: string, dto: AddMemberDto): Promise<{
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
    }>;
    getPendingRegistrations(): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        createdAt: Date;
    }[]>;
    private createInvitedUser;
    private normalizeRoles;
    private primaryRole;
    removeMember(messId: string, userId: string): Promise<{
        message: string;
    }>;
    getMembers(messId: string): Promise<{
        id: string;
        userId: string;
        userName: string;
        userEmail: string;
        userPhone: string;
        userProfileImage: string;
        role: import(".prisma/client").$Enums.MessRole;
        roles: import(".prisma/client").$Enums.MessRole[];
        joinedDate: Date;
        balance: number;
    }[]>;
    updateMemberRole(messId: string, userId: string, role: string, requestedRoles?: string[]): Promise<{
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
    }>;
}
