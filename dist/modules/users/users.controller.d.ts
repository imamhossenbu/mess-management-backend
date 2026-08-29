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
            userId: string;
            lastUpdated: Date;
            balance: import("@prisma/client/runtime/library").Decimal;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    findAll(): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        meals: {
            id: string;
            date: Date;
            totalMeal: number;
            lunch: boolean;
            dinner: boolean;
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
            imageUrl: string | null;
            shopName: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            paymentType: import(".prisma/client").$Enums.PaymentType;
        })[];
        payments: {
            id: string;
            note: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    uploadProfileImage(req: any, file: any): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    removeProfileImage(req: any): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    remove(id: string): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    hardDelete(id: string): Promise<{
        message: string;
    }>;
}
