export declare class UserResponseDto {
    id: string;
    name: string;
    phone: string;
    email?: string;
    role: string;
    profileImage?: string;
    isActive: boolean;
    approvalStatus: string;
    joinedDate: Date;
    leftDate?: Date;
    balance?: number;
    createdAt: Date;
    updatedAt: Date;
}
