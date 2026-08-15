import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto, UpdateUserDto, UpdateProfileDto } from "./dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { NotificationsService } from "../notifications/notifications.service";
export declare class UsersService {
    private prisma;
    private cloudinaryService;
    private notificationsService;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService, notificationsService: NotificationsService);
    create(createUserDto: CreateUserDto): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        userBalance: {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            balance: import("@prisma/client/runtime/library").Decimal;
            lastUpdated: Date;
        };
        name: string;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    findAll(): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        name: string;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
            morning: boolean;
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
                quantity: import("@prisma/client/runtime/library").Decimal;
                marketingId: string;
                itemName: string;
                unit: import(".prisma/client").$Enums.Unit;
                price: import("@prisma/client/runtime/library").Decimal;
                totalPrice: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
        name: string;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        name: string;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        name: string;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    updateProfileImage(userId: string, file: any): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        name: string;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    removeProfileImage(userId: string): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        name: string;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    remove(id: string): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
        name: string;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
    findByPhone(phone: string): Promise<{
        userBalance: {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            balance: import("@prisma/client/runtime/library").Decimal;
            lastUpdated: Date;
        };
    } & {
        name: string;
        email: string;
        password: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    findByEmail(email: string): Promise<{
        userBalance: {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            balance: import("@prisma/client/runtime/library").Decimal;
            lastUpdated: Date;
        };
    } & {
        name: string;
        email: string;
        password: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        isActive: boolean;
        approvalStatus: import(".prisma/client").$Enums.ApprovalStatus;
        joinedDate: Date;
        leftDate: Date | null;
    }>;
    updateBalance(userId: string, amount: number): Promise<{
        userId: string;
        balance: number;
    }>;
    getUserStats(userId: string): Promise<{
        userId: string;
        name: string;
        balance: number | import("@prisma/client/runtime/library").Decimal;
        totalMeals: number;
        totalPayments: number;
        totalMarketing: number;
        mealCount: number;
        paymentCount: number;
        marketingCount: number;
    }>;
}
