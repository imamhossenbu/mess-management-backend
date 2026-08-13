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
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user with MEMBER role by default
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
    });

    const { password, ...userWithoutPassword } = user;

    // Send welcome notification
    try {
      await this.notificationsService.create({
        userId: user.id,
        type: "SYSTEM",
        title: "Welcome to the Mess!",
        message: `Hello ${user.name}, your account has been created successfully.`,
        link: "/profile",
      });
    } catch (error) {
      console.error("Failed to send welcome notification:", error);
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
        profileImage: true,
        isActive: true,
        approvalStatus: true,
        joinedDate: true,
        leftDate: true,
        createdAt: true,
        updatedAt: true,
        userBalance: {
          select: {
            balance: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform to include balance directly
    return users.map((user) => ({
      ...user,
      balance: user.userBalance?.balance || 0,
      userBalance: undefined,
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
        profileImage: true,
        isActive: true,
        approvalStatus: true,
        joinedDate: true,
        leftDate: true,
        createdAt: true,
        updatedAt: true,
        userBalance: {
          select: {
            balance: true,
          },
        },
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
          select: {
            id: true,
            date: true,
            itemName: true,
            amount: true,
            shopName: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Transform to include balance directly
    return {
      ...user,
      balance: user.userBalance?.balance || 0,
      userBalance: undefined,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    // Check email uniqueness if updating
    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          NOT: { id },
        },
      });

      if (existingUser) {
        throw new ConflictException("Email already taken by another user");
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        phone: updateUserDto.phone,
        email: updateUserDto.email,
        isActive: updateUserDto.isActive,
        role: updateUserDto.role as any,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        profileImage: true,
        isActive: true,
        approvalStatus: true,
        joinedDate: true,
        leftDate: true,
        createdAt: true,
        updatedAt: true,
        userBalance: {
          select: {
            balance: true,
          },
        },
      },
    });

    // Send notification
    try {
      await this.notificationsService.create({
        userId: id,
        type: "SYSTEM",
        title: "Profile Updated",
        message: "Your profile information has been updated successfully.",
        link: "/profile",
      });
    } catch (error) {
      console.error("Failed to send profile update notification:", error);
    }

    return {
      ...updatedUser,
      balance: updatedUser.userBalance?.balance || 0,
      userBalance: undefined,
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (updateProfileDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: updateProfileDto.email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException("Email already taken by another user");
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateProfileDto.name,
        phone: updateProfileDto.phone,
        email: updateProfileDto.email,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        profileImage: true,
        isActive: true,
        approvalStatus: true,
        joinedDate: true,
        leftDate: true,
        createdAt: true,
        updatedAt: true,
        userBalance: {
          select: {
            balance: true,
          },
        },
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
    } catch (error) {
      console.error("Failed to send profile update notification:", error);
    }

    return {
      ...updatedUser,
      balance: updatedUser.userBalance?.balance || 0,
      userBalance: undefined,
    };
  }

  async updateProfileImage(userId: string, file: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Delete old image if exists
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
        profileImage: true,
        isActive: true,
        approvalStatus: true,
        joinedDate: true,
        leftDate: true,
        createdAt: true,
        updatedAt: true,
        userBalance: {
          select: {
            balance: true,
          },
        },
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
    } catch (error) {
      console.error("Failed to send profile image notification:", error);
    }

    return {
      ...updatedUser,
      balance: updatedUser.userBalance?.balance || 0,
      userBalance: undefined,
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
        profileImage: true,
        isActive: true,
        approvalStatus: true,
        joinedDate: true,
        leftDate: true,
        createdAt: true,
        updatedAt: true,
        userBalance: {
          select: {
            balance: true,
          },
        },
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
    } catch (error) {
      console.error(
        "Failed to send profile image removal notification:",
        error,
      );
    }

    return {
      ...updatedUser,
      balance: updatedUser.userBalance?.balance || 0,
      userBalance: undefined,
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
        approvalStatus: true,
        leftDate: true,
      },
    });

    try {
      await this.notificationsService.create({
        userId: id,
        type: "SYSTEM",
        title: "Account Deactivated",
        message:
          "Your account has been deactivated. Please contact admin for more information.",
        link: "/",
      });
    } catch (error) {
      console.error("Failed to send account deactivation notification:", error);
    }

    return deactivatedUser;
  }

  async hardDelete(id: string) {
    await this.findOne(id);

    // Delete all related records
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

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} deleted successfully` };
  }

  async findByPhone(phone: string) {
    return this.prisma.user.findFirst({
      where: { phone },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateBalance(userId: string, amount: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userBalance: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
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
    } else {
      await this.prisma.userBalance.create({
        data: {
          userId: userId,
          balance: newBalance,
        },
      });
    }

    const message =
      amount > 0
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
    } catch (error) {
      console.error("Failed to send balance update notification:", error);
    }

    return {
      userId,
      balance: newBalance,
    };
  }
}
