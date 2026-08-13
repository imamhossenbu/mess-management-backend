"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../prisma/prisma.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const notifications_service_1 = require("../notifications/notifications.service");
let UsersService = class UsersService {
    constructor(prisma, cloudinaryService, notificationsService) {
        this.prisma = prisma;
        this.cloudinaryService = cloudinaryService;
        this.notificationsService = notificationsService;
    }
    async create(createUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("User already exists with this email");
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: createUserDto.name,
                phone: createUserDto.phone || "",
                email: createUserDto.email,
                password: hashedPassword,
                profileImage: null,
                isActive: true,
                approvalStatus: "APPROVED",
                role: "MEMBER",
                userBalance: {
                    create: {
                        balance: 0,
                    },
                },
            },
            include: {
                userBalance: true,
            },
        });
        const { password, ...userWithoutPassword } = user;
        try {
            await this.notificationsService.create({
                userId: user.id,
                type: "SYSTEM",
                title: "Welcome to the Mess!",
                message: `Hello ${user.name}, your account has been created successfully.`,
                link: "/profile",
            });
        }
        catch (error) {
            console.error("Failed to send welcome notification:", error);
        }
        return {
            ...userWithoutPassword,
            balance: user.userBalance?.balance || 0,
        };
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            include: {
                userBalance: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return users.map((user) => {
            const { password, userBalance, ...safeUser } = user;
            return {
                ...safeUser,
                balance: userBalance?.balance || 0,
            };
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                userBalance: true,
                meals: {
                    take: 5,
                    orderBy: { date: "desc" },
                    select: {
                        id: true,
                        date: true,
                        morning: true,
                        lunch: true,
                        dinner: true,
                        totalMeal: true,
                    },
                },
                payments: {
                    take: 5,
                    orderBy: { paymentDate: "desc" },
                    select: {
                        id: true,
                        amount: true,
                        paymentDate: true,
                        paymentMethod: true,
                        note: true,
                    },
                },
                marketings: {
                    take: 5,
                    orderBy: { date: "desc" },
                    include: {
                        items: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const { password, userBalance, ...safeUser } = user;
        return {
            ...safeUser,
            balance: userBalance?.balance || 0,
        };
    }
    async update(id, updateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
            include: {
                userBalance: true,
            },
        });
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (updateUserDto.email) {
            const userWithEmail = await this.prisma.user.findFirst({
                where: {
                    email: updateUserDto.email,
                    NOT: { id },
                },
            });
            if (userWithEmail) {
                throw new common_1.ConflictException("Email already taken by another user");
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                name: updateUserDto.name,
                phone: updateUserDto.phone,
                email: updateUserDto.email,
                isActive: updateUserDto.isActive,
                role: updateUserDto.role,
            },
            include: {
                userBalance: true,
            },
        });
        try {
            await this.notificationsService.create({
                userId: id,
                type: "SYSTEM",
                title: "Profile Updated",
                message: "Your profile information has been updated successfully.",
                link: "/profile",
            });
        }
        catch (error) {
            console.error("Failed to send profile update notification:", error);
        }
        const { password, userBalance, ...safeUser } = updatedUser;
        return {
            ...safeUser,
            balance: userBalance?.balance || 0,
        };
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                userBalance: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (updateProfileDto.email) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    email: updateProfileDto.email,
                    NOT: { id: userId },
                },
            });
            if (existingUser) {
                throw new common_1.ConflictException("Email already taken by another user");
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: updateProfileDto.name,
                phone: updateProfileDto.phone,
                email: updateProfileDto.email,
            },
            include: {
                userBalance: true,
            },
        });
        try {
            await this.notificationsService.create({
                userId: userId,
                type: "SYSTEM",
                title: "Profile Updated",
                message: "Your profile information has been updated successfully.",
                link: "/profile",
            });
        }
        catch (error) {
            console.error("Failed to send profile update notification:", error);
        }
        const { password, userBalance, ...safeUser } = updatedUser;
        return {
            ...safeUser,
            balance: userBalance?.balance || 0,
        };
    }
    async updateProfileImage(userId, file) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                userBalance: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (user.profileImage) {
            await this.cloudinaryService.deleteProfileImage(user.profileImage);
        }
        const imageUrl = await this.cloudinaryService.uploadProfileImage(file, userId);
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                profileImage: imageUrl,
            },
            include: {
                userBalance: true,
            },
        });
        try {
            await this.notificationsService.create({
                userId: userId,
                type: "SYSTEM",
                title: "Profile Image Updated",
                message: "Your profile image has been updated successfully.",
                link: "/profile",
            });
        }
        catch (error) {
            console.error("Failed to send profile image notification:", error);
        }
        const { password, userBalance, ...safeUser } = updatedUser;
        return {
            ...safeUser,
            balance: userBalance?.balance || 0,
        };
    }
    async removeProfileImage(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                userBalance: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (!user.profileImage) {
            throw new common_1.BadRequestException("No profile image to remove");
        }
        await this.cloudinaryService.deleteProfileImage(user.profileImage);
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                profileImage: null,
            },
            include: {
                userBalance: true,
            },
        });
        try {
            await this.notificationsService.create({
                userId: userId,
                type: "SYSTEM",
                title: "Profile Image Removed",
                message: "Your profile image has been removed successfully.",
                link: "/profile",
            });
        }
        catch (error) {
            console.error("Failed to send profile image removal notification:", error);
        }
        const { password, userBalance, ...safeUser } = updatedUser;
        return {
            ...safeUser,
            balance: userBalance?.balance || 0,
        };
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                userBalance: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const deactivatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                isActive: false,
                leftDate: new Date(),
            },
            include: {
                userBalance: true,
            },
        });
        try {
            await this.notificationsService.create({
                userId: id,
                type: "SYSTEM",
                title: "Account Deactivated",
                message: "Your account has been deactivated. Please contact admin for more information.",
                link: "/",
            });
        }
        catch (error) {
            console.error("Failed to send account deactivation notification:", error);
        }
        const { password, userBalance, ...safeUser } = deactivatedUser;
        return {
            ...safeUser,
            balance: userBalance?.balance || 0,
        };
    }
    async hardDelete(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        await this.prisma.meal.deleteMany({
            where: { userId: id },
        });
        await this.prisma.marketing.deleteMany({
            where: { userId: id },
        });
        await this.prisma.payment.deleteMany({
            where: { userId: id },
        });
        await this.prisma.monthlySummary.deleteMany({
            where: { userId: id },
        });
        await this.prisma.userBalance.delete({
            where: { userId: id },
        });
        await this.prisma.notification.deleteMany({
            where: { userId: id },
        });
        await this.prisma.emailLog.deleteMany({
            where: { userId: id },
        });
        await this.prisma.user.delete({
            where: { id },
        });
        return { message: `User with ID ${id} deleted successfully` };
    }
    async findByPhone(phone) {
        return this.prisma.user.findFirst({
            where: { phone },
            include: {
                userBalance: true,
            },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                userBalance: true,
            },
        });
    }
    async updateBalance(userId, amount) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { userBalance: true },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const currentBalance = user.userBalance
            ? Number(user.userBalance.balance)
            : 0;
        const newBalance = currentBalance + amount;
        if (user.userBalance) {
            await this.prisma.userBalance.update({
                where: { userId: userId },
                data: {
                    balance: newBalance,
                    lastUpdated: new Date(),
                },
            });
        }
        else {
            await this.prisma.userBalance.create({
                data: {
                    userId: userId,
                    balance: newBalance,
                },
            });
        }
        const message = amount > 0
            ? `${amount} TK has been added to your balance. Current balance: ${newBalance} TK`
            : `${Math.abs(amount)} TK has been deducted from your balance. Current balance: ${newBalance} TK`;
        try {
            await this.notificationsService.create({
                userId: userId,
                type: "PAYMENT",
                title: "Balance Updated",
                message,
                link: "/payments",
            });
        }
        catch (error) {
            console.error("Failed to send balance update notification:", error);
        }
        return {
            userId,
            balance: newBalance,
        };
    }
    async getUserStats(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                userBalance: true,
                meals: true,
                payments: true,
                marketings: {
                    include: {
                        items: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const totalMeals = user.meals.reduce((sum, m) => sum + m.totalMeal, 0);
        const totalPayments = user.payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const totalMarketing = user.marketings.reduce((sum, m) => sum + Number(m.totalAmount), 0);
        return {
            userId: user.id,
            name: user.name,
            balance: user.userBalance?.balance || 0,
            totalMeals,
            totalPayments,
            totalMarketing,
            mealCount: user.meals.length,
            paymentCount: user.payments.length,
            marketingCount: user.marketings.length,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService,
        notifications_service_1.NotificationsService])
], UsersService);
//# sourceMappingURL=users.service.js.map