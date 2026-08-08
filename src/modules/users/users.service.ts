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
import { NotificationsService } from "../notifications/notifications.service"; // ✅ Import

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private notificationsService: NotificationsService, // ✅ Inject
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

    // ✅ Send welcome notification
    await this.notificationsService.create({
      userId: user.id,
      type: "SYSTEM",
      title: "Welcome to the Mess!",
      message: `Hello ${user.name}, your account has been created successfully with role: ${user.role}`,
      link: "/profile",
    });

    // ✅ Notify admins about new user
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "MANAGER"] },
        isActive: true,
      },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "SYSTEM",
        title: "New User Registered",
        message: `${user.name} has joined the mess as ${user.role}`,
        link: `/users/${user.id}`,
      });
    }

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

    // ✅ Send notification for profile update
    await this.notificationsService.create({
      userId: id,
      type: "SYSTEM",
      title: "Profile Updated",
      message: "Your profile information has been updated successfully.",
      link: "/profile",
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

    // ✅ Send notification for profile update
    await this.notificationsService.create({
      userId: userId,
      type: "SYSTEM",
      title: "Profile Updated",
      message: "Your profile information has been updated successfully.",
      link: "/profile",
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

    // ✅ Send notification for profile image update
    await this.notificationsService.create({
      userId: userId,
      type: "SYSTEM",
      title: "Profile Image Updated",
      message: "Your profile image has been updated successfully.",
      link: "/profile",
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

    // ✅ Send notification for profile image removal
    await this.notificationsService.create({
      userId: userId,
      type: "SYSTEM",
      title: "Profile Image Removed",
      message: "Your profile image has been removed successfully.",
      link: "/profile",
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
    const user = await this.findOne(id);

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

    // ✅ Send notification for deactivation
    await this.notificationsService.create({
      userId: id,
      type: "SYSTEM",
      title: "Account Deactivated",
      message:
        "Your account has been deactivated. Please contact admin for more information.",
      link: "/",
    });

    // ✅ Notify admins about deactivation
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "MANAGER"] },
        isActive: true,
      },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "SYSTEM",
        title: "User Account Deactivated",
        message: `${user.name}'s account has been deactivated.`,
        link: `/users/${id}`,
      });
    }

    return deactivatedUser;
  }

  async hardDelete(id: string) {
    const user = await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    // ✅ Notify admins about permanent deletion
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "MANAGER"] },
        isActive: true,
      },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        userId: admin.id,
        type: "SYSTEM",
        title: "User Account Permanently Deleted",
        message: `${user.name}'s account has been permanently deleted from the system.`,
        link: "/users",
      });
    }

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

    // ✅ Send notification for balance update
    if (amount > 0) {
      await this.notificationsService.create({
        userId: userId,
        type: "PAYMENT",
        title: "Balance Updated",
        message: `${amount} TK has been added to your balance. Current balance: ${newBalance} TK`,
        link: "/payments",
      });
    } else if (amount < 0) {
      await this.notificationsService.create({
        userId: userId,
        type: "PAYMENT",
        title: "Balance Updated",
        message: `${Math.abs(amount)} TK has been deducted from your balance. Current balance: ${newBalance} TK`,
        link: "/payments",
      });
    }

    return {
      ...updated,
      balance: Number(updated.balance),
    };
  }
}
