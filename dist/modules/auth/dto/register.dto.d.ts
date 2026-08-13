export declare enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    MANAGER = "MANAGER",
    MEMBER = "MEMBER"
}
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    phone?: string;
    roomNumber?: string;
}
