export declare enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    MANAGER = "MANAGER",
    MEMBER = "MEMBER"
}
export declare class RegisterDto {
    name: string;
    phone: string;
    email?: string;
    password: string;
    roomNumber?: string;
    role?: Role;
}
