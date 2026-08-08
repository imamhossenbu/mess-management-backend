import { Role } from "../../auth/dto/register.dto";
export declare class UpdateUserDto {
    name?: string;
    phone?: string;
    email?: string;
    roomNumber?: string;
    role?: Role;
    isActive?: boolean;
}
