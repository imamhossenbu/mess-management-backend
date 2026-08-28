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

  // ==================== CREATE ====================

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
      include: {
        userBalance: true,
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

    return {
      ...userWithoutPassword,
      balance: user.userBalance?.balance || 0,
    };
  }

  // ==================== FIND ALL ====================

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

  // ==================== FIND ONE ====================

  async findOne(id: string) {
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
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, userBalance, ...safeUser } = user;

    return {
      ...safeUser,
      balance: userBalance?.balance || 0,
    };
  }

  // ==================== UPDATE ====================

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userBalance: true,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check email uniqueness if updating
    if (updateUserDto.email) {
      const userWithEmail = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          NOT: { id },
        },
      });

      if (userWithEmail) {
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
        approvalStatus: updateUserDto.approvalStatus as any,
      },
      include: {
        userBalance: true,
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

    const { password, userBalance, ...safeUser } = updatedUser;

    return {
      ...safeUser,
      balance: userBalance?.balance || 0,
    };
  }

  // ==================== UPDATE PROFILE ====================

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userBalance: true,
      },
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
    } catch (error) {
      console.error("Failed to send profile update notification:", error);
    }

    const { password, userBalance, ...safeUser } = updatedUser;

    return {
      ...safeUser,
      balance: userBalance?.balance || 0,
    };
  }

  // ==================== UPDATE PROFILE IMAGE ====================

  async updateProfileImage(userId: string, file: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userBalance: true,
      },
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
    } catch (error) {
      console.error("Failed to send profile image notification:", error);
    }

    const { password, userBalance, ...safeUser } = updatedUser;

    return {
      ...safeUser,
      balance: userBalance?.balance || 0,
    };
  }

  // ==================== REMOVE PROFILE IMAGE ====================

  async removeProfileImage(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userBalance: true,
      },
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
    } catch (error) {
      console.error(
        "Failed to send profile image removal notification:",
        error,
      );
    }

    const { password, userBalance, ...safeUser } = updatedUser;

    return {
      ...safeUser,
      balance: userBalance?.balance || 0,
    };
  }

  // ==================== DEACTIVATE USER ====================

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userBalance: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
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
        message:
          "Your account has been deactivated. Please contact admin for more information.",
        link: "/",
      });
    } catch (error) {
      console.error("Failed to send account deactivation notification:", error);
    }

    const { password, userBalance, ...safeUser } = deactivatedUser;

    return {
      ...safeUser,
      balance: userBalance?.balance || 0,
    };
  }

  // ==================== HARD DELETE USER ====================

  async hardDelete(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

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

    await this.prisma.notification.deleteMany({
      where: { userId: id },
    });

    await this.prisma.emailLog.deleteMany({
      where: { userId: id },
    });

    // Clear foreign keys that don't cascade delete
    await this.prisma.utilityBill.updateMany({
      where: { paidBy: id },
      data: { paidBy: null },
    });

    await this.prisma.shopDebt.updateMany({
      where: { recordedById: id },
      data: { recordedById: null },
    });

    await this.prisma.shopPayment.updateMany({
      where: { paidById: id },
      data: { paidById: null },
    });

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} deleted successfully` };
  }

  // ==================== FIND BY PHONE ====================

  async findByPhone(phone: string) {
    return this.prisma.user.findFirst({
      where: { phone },
      include: {
        userBalance: true,
      },
    });
  }

  // ==================== FIND BY EMAIL ====================

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        userBalance: true,
      },
    });
  }

  // ==================== UPDATE BALANCE ====================

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

  // ==================== GET USER STATS ====================

  async getUserStats(userId: string) {
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
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const totalMeals = user.meals.reduce((sum, m) => sum + m.totalMeal, 0);
    const totalPayments = user.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );
    const totalMarketing = user.marketings.reduce(
      (sum, m) => sum + Number(m.totalAmount),
      0,
    );

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
}
