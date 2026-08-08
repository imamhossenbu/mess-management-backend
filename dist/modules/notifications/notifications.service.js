"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let NotificationsService = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createNotificationDto) {
        const { userId, type, title, message, link, isRead } = createNotificationDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
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
    async createBulk(bulkNotificationDto) {
        const { userIds, type, title, message, link } = bulkNotificationDto;
        const users = await this.prisma.user.findMany({
            where: {
                id: { in: userIds },
            },
            select: { id: true },
        });
        if (users.length !== userIds.length) {
            throw new common_1.BadRequestException("Some users not found");
        }
        const notifications = await this.prisma.$transaction(userIds.map((userId) => this.prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                link: link || null,
                isRead: false,
            },
        })));
        return {
            message: `${notifications.length} notifications created successfully`,
            count: notifications.length,
            notifications,
        };
    }
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
        }
        return notification;
    }
    async findByUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
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
    async getUnreadCount(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const count = await this.prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
        return { unreadCount: count };
    }
    async markAsRead(id) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
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
    async markAllAsRead(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
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
    async remove(id) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
        }
        await this.prisma.notification.delete({
            where: { id },
        });
        return { message: `Notification with ID ${id} deleted successfully` };
    }
    async removeAll(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const result = await this.prisma.notification.deleteMany({
            where: { userId },
        });
        return {
            message: `Deleted ${result.count} notifications for user`,
            count: result.count,
        };
    }
    async sendEmail(sendEmailDto) {
        const { email, subject, message, html } = sendEmailDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
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
        await this.create({
            userId: user.id,
            type: client_1.NotificationType.EMAIL,
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
    async sendBillNotification(userId, billAmount, dueDate) {
        const title = "Monthly Bill";
        const message = `Your monthly bill is ${billAmount} TK. Due date: ${dueDate.toLocaleDateString()}`;
        return this.create({
            userId,
            type: client_1.NotificationType.BILL,
            title,
            message,
            link: "/bills",
            isRead: false,
        });
    }
    async sendPaymentConfirmation(userId, amount) {
        const title = "Payment Confirmation";
        const message = `Your payment of ${amount} TK has been received.`;
        return this.create({
            userId,
            type: client_1.NotificationType.PAYMENT,
            title,
            message,
            link: "/payments",
            isRead: false,
        });
    }
    async sendMealReminder(userId, mealType) {
        const title = "Meal Reminder";
        const message = `Please register for today's ${mealType} meal.`;
        return this.create({
            userId,
            type: client_1.NotificationType.MEAL,
            title,
            message,
            link: "/meals",
            isRead: false,
        });
    }
    async sendInventoryAlert(type, quantity) {
        const title = "Inventory Alert";
        const message = `${type} stock is running low! Only ${quantity} pieces left.`;
        const admins = await this.prisma.messMember.findMany({
            where: {
                role: {
                    in: ["SUPER_ADMIN", "ADMIN"],
                },
                isActive: true,
            },
            include: {
                user: true,
            },
        });
        if (admins.length === 0) {
            return {
                message: "No admins found to send alert",
                count: 0,
            };
        }
        const notifications = await this.prisma.$transaction(admins.map((admin) => this.prisma.notification.create({
            data: {
                userId: admin.userId,
                type: client_1.NotificationType.INVENTORY,
                title,
                message,
                link: "/inventory",
                isRead: false,
            },
        })));
        return {
            message: `Inventory alert sent to ${notifications.length} admins`,
            count: notifications.length,
        };
    }
    async sendMonthlySummaryNotification(year, month) {
        const title = "Monthly Summary";
        const message = `Summary for ${month}/${year} has been generated. Click to view details.`;
        const users = await this.prisma.user.findMany({
            where: { isActive: true },
            select: { id: true },
        });
        if (users.length === 0) {
            return {
                message: "No active users found",
                count: 0,
            };
        }
        const notifications = await this.prisma.$transaction(users.map((user) => this.prisma.notification.create({
            data: {
                userId: user.id,
                type: client_1.NotificationType.SUMMARY,
                title,
                message,
                link: `/monthly-summary?year=${year}&month=${month}`,
                isRead: false,
            },
        })));
        return {
            message: `Monthly summary notification sent to ${notifications.length} users`,
            count: notifications.length,
        };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map