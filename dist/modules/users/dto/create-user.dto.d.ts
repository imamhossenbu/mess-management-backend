import { Role } from "../../auth/dto/register.dto";
export declare class CreateUserDto {
    name: string;
    phone: string;
    email?: string;
    password: string;
    roomNumber?: string;
    role?: Role;
    isActive?: boolean;
}
