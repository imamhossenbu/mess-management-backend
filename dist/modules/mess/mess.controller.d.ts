import { MessService } from "./mess.service";
import { CreateMessDto, UpdateMessDto, AddMemberDto, UpdateRoleDto } from "./dto";
export declare class MessController {
    private readonly messService;
    constructor(messService: MessService);
    create(req: any, createMessDto: CreateMessDto): Promise<void>;
    getUserMesses(req: any): Promise<any>;
    getPendingRegistrations(): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        name: string;
        phone: string;
    }[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateMessDto: UpdateMessDto): Promise<any>;
    remove(id: string): Promise<void>;
    getMembers(id: string): Promise<any>;
    addMember(id: string, addMemberDto: AddMemberDto): Promise<any>;
    removeMember(id: string, userId: string): Promise<{
        message: string;
    }>;
    updateMemberRole(id: string, userId: string, updateRoleDto: UpdateRoleDto): Promise<any>;
}
