import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto, UpdateProfileDto } from "./dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        userBalance: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            balance: import("@prisma/client/runtime/library").Decimal;
            lastUpdated: Date;
            userId: string;
        };
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        balance: number;
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        balance: number;
        meals: {
            id: string;
            date: Date;
            lunch: boolean;
            dinner: boolean;
            totalMeal: number;
        }[];
        marketings: ({
            items: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                note: string | null;
                marketingId: string;
                itemName: string;
                quantity: import("@prisma/client/runtime/library").Decimal;
                unit: import(".prisma/client").$Enums.Unit;
                price: import("@prisma/client/runtime/library").Decimal;
                totalPrice: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            note: string | null;
            imageUrl: string | null;
            shopName: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            paymentType: import(".prisma/client").$Enums.PaymentType;
        })[];
        payments: {
            id: string;
            paymentDate: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            note: string;
        }[];
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    uploadProfileImage(req: any, file: any): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeProfileImage(req: any): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    hardDelete(id: string): Promise<{
        message: string;
    }>;
}
