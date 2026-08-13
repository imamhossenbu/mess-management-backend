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
    create(userId: string, createMessDto: CreateMessDto): Promise<any>;
    getUserMesses(userId: string): Promise<any>;
    findOne(messId: string): Promise<any>;
    findById(messId: string): Promise<any>;
    update(messId: string, updateMessDto: UpdateMessDto): Promise<any>;
    remove(messId: string): Promise<{
        message: string;
    }>;
    addMember(messId: string, dto: AddMemberDto): Promise<any>;
    getPendingRegistrations(): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        name: string;
        phone: string;
    }[]>;
    private createInvitedUser;
    private normalizeRoles;
    private primaryRole;
    removeMember(messId: string, userId: string): Promise<{
        message: string;
    }>;
    getMembers(messId: string): Promise<any>;
    updateMemberRole(messId: string, userId: string, role: string, requestedRoles?: string[]): Promise<any>;
}
