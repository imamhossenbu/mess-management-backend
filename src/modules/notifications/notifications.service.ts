// src/modules/notifications/notifications.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  BulkNotificationDto,
  SendEmailDto,
} from "./dto";
import { NotificationType } from "@prisma/client";

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // ==================== CREATE ====================

  async create(createNotificationDto: CreateNotificationDto) {
    const { userId, type, title, message, link, isRead } =
      createNotificationDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link: link || null,
        isRead: isRead || false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    return notification;
  }

  // ==================== BULK CREATE ====================

  async createBulk(bulkNotificationDto: BulkNotificationDto) {
    const { userIds, type, title, message, link } = bulkNotificationDto;

    // Check if all users exist
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: { id: true },
    });

    if (users.length !== userIds.length) {
      throw new BadRequestException("Some users not found");
    }

    const notifications = await this.prisma.$transaction(
      userIds.map((userId) =>
        this.prisma.notification.create({
          data: {
            userId,
            type,
            title,
            message,
            link: link || null,
            isRead: false,
          },
        }),
      ),
    );

    return {
      message: `${notifications.length} notifications created successfully`,
      count: notifications.length,
      notifications,
    };
  }

  // ==================== FIND ====================

  async findAll() {
    return this.prisma.notification.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async findByUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.notification.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getUnreadCount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { unreadCount: count };
  }

  // ==================== UPDATE ====================

  async markAsRead(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });
  }

  async markAllAsRead(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return {
      message: `Marked ${result.count} notifications as read`,
      count: result.count,
    };
  }

  // ==================== DELETE ====================

  async remove(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    await this.prisma.notification.delete({
      where: { id },
    });

    return { message: `Notification with ID ${id} deleted successfully` };
  }

  async removeAll(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const result = await this.prisma.notification.deleteMany({
      where: { userId },
    });

    return {
      message: `Deleted ${result.count} notifications for user`,
      count: result.count,
    };
  }

  // ==================== EMAIL ====================

  async sendEmail(sendEmailDto: SendEmailDto) {
    const { email, subject, message, html } = sendEmailDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Here you would integrate with your email service (Nodemailer, SendGrid, etc.)
    // For now, we'll just log and save to database

    const emailLog = await this.prisma.emailLog.create({
      data: {
        userId: user.id,
        email,
        subject,
        message,
        html: html || null,
        sentAt: new Date(),
      },
    });

    // Create in-app notification
    await this.create({
      userId: user.id,
      type: NotificationType.EMAIL,
      title: subject,
      message: message.substring(0, 200),
      link: null,
      isRead: false,
    });

    return {
      message: "Email sent successfully",
      emailLog,
    };
  }

  // ==================== SYSTEM NOTIFICATIONS ====================

  async sendBillNotification(
    userId: string,
    billAmount: number,
    dueDate: Date,
  ) {
    const title = "মাসিক বিল";
    const message = `আপনার এই মাসের বিল ${billAmount} টাকা। শেষ তারিখ: ${dueDate.toLocaleDateString()}`;

    return this.create({
      userId,
      type: NotificationType.BILL,
      title,
      message,
      link: "/bills",
      isRead: false,
    });
  }

  async sendPaymentConfirmation(userId: string, amount: number) {
    const title = "পেমেন্ট নিশ্চিতকরণ";
    const message = `আপনার ${amount} টাকার পেমেন্ট গ্রহণ করা হয়েছে।`;

    return this.create({
      userId,
      type: NotificationType.PAYMENT,
      title,
      message,
      link: "/payments",
      isRead: false,
    });
  }

  async sendMealReminder(userId: string, mealType: string) {
    const title = "খাবারের রিমাইন্ডার";
    const message = `আজকের ${mealType} খাবারের জন্য নিবন্ধন করুন।`;

    return this.create({
      userId,
      type: NotificationType.MEAL,
      title,
      message,
      link: "/meals",
      isRead: false,
    });
  }

  async sendInventoryAlert(type: string, quantity: number) {
    const title = "ইনভেন্টরি এলার্ট";
    const message = `${type} স্টক প্রায় শেষ! বাকি আছে ${quantity} পিস।`;

    // Send to all managers and super admins
    const admins = await this.prisma.user.findMany({
      where: {
        role: {
          in: ["SUPER_ADMIN", "MANAGER"],
        },
        isActive: true,
      },
    });

    const notifications = await this.prisma.$transaction(
      admins.map((admin) =>
        this.prisma.notification.create({
          data: {
            userId: admin.id,
            type: NotificationType.INVENTORY,
            title,
            message,
            link: "/inventory",
            isRead: false,
          },
        }),
      ),
    );

    return {
      message: `Inventory alert sent to ${notifications.length} admins`,
      count: notifications.length,
    };
  }

  async sendMonthlySummaryNotification(year: number, month: number) {
    const title = "মাসিক সারাংশ";
    const message = `${month}/${year} মাসের সারাংশ তৈরি হয়েছে। বিস্তারিত দেখতে ক্লিক করুন।`;

    // Send to all active users
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    const notifications = await this.prisma.$transaction(
      users.map((user) =>
        this.prisma.notification.create({
          data: {
            userId: user.id,
            type: NotificationType.SUMMARY,
            title,
            message,
            link: `/monthly-summary?year=${year}&month=${month}`,
            isRead: false,
          },
        }),
      ),
    );

    return {
      message: `Monthly summary notification sent to ${notifications.length} users`,
      count: notifications.length,
    };
  }
}
