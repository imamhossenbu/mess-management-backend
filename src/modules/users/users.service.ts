// src/modules/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto, UpdateUserDto, UpdateProfileDto } from "./dto";
import { Role } from "../auth/dto/register.dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ phone: createUserDto.phone }, { email: createUserDto.email }],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        "User already exists with this phone or email",
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        phone: createUserDto.phone,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role || Role.MEMBER,
        roomNumber: createUserDto.roomNumber,
        isActive:
          createUserDto.isActive !== undefined ? createUserDto.isActive : true,
        // profileImage ডিফল্ট null থাকবে
      },
    });

    // Create user balance
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

    // Transform Decimal to number
    return users.map((user) => ({
      ...user,
      balance: user.balances?.[0]?.balance
        ? Number(user.balances[0].balance)
        : 0,
      balances: undefined,
    }));
  }

  async findOne(id: string) {
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
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      ...user,
      balance: user.balances?.[0]?.balance
        ? Number(user.balances[0].balance)
        : 0,
      balances: undefined,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.phone || updateUserDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ phone: updateUserDto.phone }, { email: updateUserDto.email }],
          NOT: { id },
        },
      });

      if (existingUser) {
        throw new ConflictException(
          "Phone or email already taken by another user",
        );
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

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
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
        throw new ConflictException(
          "Phone or email already taken by another user",
        );
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

  async updateProfileImage(userId: string, file: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.profileImage) {
      await this.cloudinaryService.deleteProfileImage(user.profileImage);
    }

    const imageUrl = await this.cloudinaryService.uploadProfileImage(
      file,
      userId,
    );

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

  async removeProfileImage(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!user.profileImage) {
      throw new BadRequestException("No profile image to remove");
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

  async remove(id: string) {
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

  async hardDelete(id: string) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} deleted successfully` };
  }

  async findByPhone(phone: string) {
    return this.prisma.user.findUnique({
      where: { phone },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateBalance(userId: string, amount: number) {
    const userBalance = await this.prisma.userBalance.findUnique({
      where: { userId },
    });

    if (!userBalance) {
      throw new NotFoundException(`User balance not found for user ${userId}`);
    }

    // ✅ Decimal to number conversion
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
}
