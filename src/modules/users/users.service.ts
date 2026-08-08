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
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException("User already exists with this email");
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
      },
    });

    const mess = await this.prisma.mess.create({
      data: {
        name: `${user.name}'s Mess`,
        slug: `mess-${Date.now()}`,
        description: "My mess",
        isActive: true,
      },
    });

    const member = await this.prisma.messMember.create({
      data: {
        userId: user.id,
        messId: mess.id,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });

    await this.prisma.userBalance.create({
      data: {
        memberId: member.id,
        balance: 0,
      },
    });

    const { password, ...userWithoutPassword } = user;

    await this.notificationsService.create({
      userId: user.id,
      type: "SYSTEM",
      title: "Welcome to the Mess!",
      message: `Hello ${user.name}, your account has been created successfully. Your mess "${mess.name}" has been created.`,
      link: "/profile",
    });

    return userWithoutPassword;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        profileImage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        messMembers: {
          include: {
            mess: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        profileImage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        messMembers: {
          include: {
            mess: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            userBalance: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

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
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        profileImage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        messMembers: {
          include: {
            mess: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    await this.notificationsService.create({
      userId: id,
      type: "SYSTEM",
      title: "Profile Updated",
      message: "Your profile information has been updated successfully.",
      link: "/profile",
    });

    return updatedUser;
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
        profileImage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        messMembers: {
          include: {
            mess: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    await this.notificationsService.create({
      userId: userId,
      type: "SYSTEM",
      title: "Profile Updated",
      message: "Your profile information has been updated successfully.",
      link: "/profile",
    });

    return updatedUser;
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
        profileImage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        messMembers: {
          include: {
            mess: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    await this.notificationsService.create({
      userId: userId,
      type: "SYSTEM",
      title: "Profile Image Updated",
      message: "Your profile image has been updated successfully.",
      link: "/profile",
    });

    return updatedUser;
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
        profileImage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        messMembers: {
          include: {
            mess: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    await this.notificationsService.create({
      userId: userId,
      type: "SYSTEM",
      title: "Profile Image Removed",
      message: "Your profile image has been removed successfully.",
      link: "/profile",
    });

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    const deactivatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        isActive: true,
      },
    });

    await this.prisma.messMember.updateMany({
      where: { userId: id },
      data: {
        isActive: false,
        leftDate: new Date(),
      },
    });

    await this.notificationsService.create({
      userId: id,
      type: "SYSTEM",
      title: "Account Deactivated",
      message:
        "Your account has been deactivated. Please contact admin for more information.",
      link: "/",
    });

    return deactivatedUser;
  }

  async hardDelete(id: string) {
    const user = await this.findOne(id);

    await this.prisma.messMember.deleteMany({
      where: { userId: id },
    });

    await this.prisma.userBalance.deleteMany({
      where: { member: { userId: id } },
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
    const member = await this.prisma.messMember.findFirst({
      where: { userId, isActive: true },
      include: { userBalance: true },
    });

    if (!member) {
      throw new NotFoundException("User is not a member of any mess");
    }

    const currentBalance = member.userBalance
      ? Number(member.userBalance.balance)
      : 0;
    const newBalance = currentBalance + amount;

    if (member.userBalance) {
      await this.prisma.userBalance.update({
        where: { memberId: member.id },
        data: {
          balance: newBalance,
          lastUpdated: new Date(),
        },
      });
    } else {
      await this.prisma.userBalance.create({
        data: {
          memberId: member.id,
          balance: newBalance,
        },
      });
    }

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
      userId,
      balance: newBalance,
    };
  }
}
