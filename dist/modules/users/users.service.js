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
const register_dto_1 = require("../auth/dto/register.dto");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let UsersService = class UsersService {
    prisma;
    cloudinaryService;
    constructor(prisma, cloudinaryService) {
        this.prisma = prisma;
        this.cloudinaryService = cloudinaryService;
    }
    async create(createUserDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ phone: createUserDto.phone }, { email: createUserDto.email }],
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException("User already exists with this phone or email");
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: createUserDto.name,
                phone: createUserDto.phone,
                email: createUserDto.email,
                password: hashedPassword,
                role: createUserDto.role || register_dto_1.Role.MEMBER,
                roomNumber: createUserDto.roomNumber,
                isActive: createUserDto.isActive !== undefined ? createUserDto.isActive : true,
            },
        });
        await this.prisma.userBalance.create({
            data: {
                userId: user.id,
                balance: 0,
            },
        });
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                roomNumber: true,
                profileImage: true,
                isActive: true,
                joinedDate: true,
                leftDate: true,
                createdAt: true,
                updatedAt: true,
                balances: {
                    select: {
                        balance: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return users.map((user) => ({
            ...user,
            balance: user.balances?.[0]?.balance
                ? Number(user.balances[0].balance)
                : 0,
            balances: undefined,
        }));
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                roomNumber: true,
                profileImage: true,
                isActive: true,
                joinedDate: true,
                leftDate: true,
                createdAt: true,
                updatedAt: true,
                balances: {
                    select: {
                        balance: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return {
            ...user,
            balance: user.balances?.[0]?.balance
                ? Number(user.balances[0].balance)
                : 0,
            balances: undefined,
        };
    }
    async update(id, updateUserDto) {
        await this.findOne(id);
        if (updateUserDto.phone || updateUserDto.email) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    OR: [{ phone: updateUserDto.phone }, { email: updateUserDto.email }],
                    NOT: { id },
                },
            });
            if (existingUser) {
                throw new common_1.ConflictException("Phone or email already taken by another user");
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                name: updateUserDto.name,
                phone: updateUserDto.phone,
                email: updateUserDto.email,
                role: updateUserDto.role,
                roomNumber: updateUserDto.roomNumber,
                isActive: updateUserDto.isActive,
            },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                roomNumber: true,
                profileImage: true,
                isActive: true,
                joinedDate: true,
                createdAt: true,
                updatedAt: true,
                balances: {
                    select: {
                        balance: true,
                    },
                },
            },
        });
        return {
            ...updatedUser,
            balance: updatedUser.balances?.[0]?.balance
                ? Number(updatedUser.balances[0].balance)
                : 0,
            balances: undefined,
        };
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (updateProfileDto.phone || updateProfileDto.email) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { phone: updateProfileDto.phone },
                        { email: updateProfileDto.email },
                    ],
                    NOT: { id: userId },
                },
            });
            if (existingUser) {
                throw new common_1.ConflictException("Phone or email already taken by another user");
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: updateProfileDto.name,
                phone: updateProfileDto.phone,
                email: updateProfileDto.email,
                roomNumber: updateProfileDto.roomNumber,
            },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                roomNumber: true,
                profileImage: true,
                isActive: true,
                joinedDate: true,
                createdAt: true,
                updatedAt: true,
                balances: {
                    select: {
                        balance: true,
                    },
                },
            },
        });
        return {
            ...updatedUser,
            balance: updatedUser.balances?.[0]?.balance
                ? Number(updatedUser.balances[0].balance)
                : 0,
            balances: undefined,
        };
    }
    async updateProfileImage(userId, file) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
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
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                roomNumber: true,
                profileImage: true,
                isActive: true,
                joinedDate: true,
                createdAt: true,
                updatedAt: true,
                balances: {
                    select: {
                        balance: true,
                    },
                },
            },
        });
        return {
            ...updatedUser,
            balance: updatedUser.balances?.[0]?.balance
                ? Number(updatedUser.balances[0].balance)
                : 0,
            balances: undefined,
        };
    }
    async removeProfileImage(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
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
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                roomNumber: true,
                profileImage: true,
                isActive: true,
                joinedDate: true,
                createdAt: true,
                updatedAt: true,
                balances: {
                    select: {
                        balance: true,
                    },
                },
            },
        });
        return {
            ...updatedUser,
            balance: updatedUser.balances?.[0]?.balance
                ? Number(updatedUser.balances[0].balance)
                : 0,
            balances: undefined,
        };
    }
    async remove(id) {
        await this.findOne(id);
        const deactivatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                isActive: false,
                leftDate: new Date(),
            },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                isActive: true,
                leftDate: true,
            },
        });
        return deactivatedUser;
    }
    async hardDelete(id) {
        await this.findOne(id);
        await this.prisma.user.delete({
            where: { id },
        });
        return { message: `User with ID ${id} deleted successfully` };
    }
    async findByPhone(phone) {
        return this.prisma.user.findUnique({
            where: { phone },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async updateBalance(userId, amount) {
        const userBalance = await this.prisma.userBalance.findUnique({
            where: { userId },
        });
        if (!userBalance) {
            throw new common_1.NotFoundException(`User balance not found for user ${userId}`);
        }
        const currentBalance = Number(userBalance.balance);
        const newBalance = currentBalance + amount;
        const updated = await this.prisma.userBalance.update({
            where: { userId },
            data: {
                balance: newBalance,
                lastUpdated: new Date(),
            },
        });
        return {
            ...updated,
            balance: Number(updated.balance),
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], UsersService);
//# sourceMappingURL=users.service.js.map