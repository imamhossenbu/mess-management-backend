import { PrismaService } from "../../prisma/prisma.service";
import { CreateMarketingDto, UpdateMarketingDto } from "./dto";
import { NotificationsService } from "../notifications/notifications.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
export declare class MarketingsService {
    private prisma;
    private notificationsService;
    private cloudinaryService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, cloudinaryService: CloudinaryService);
    create(userId: string, createMarketingDto: CreateMarketingDto, file?: any): Promise<{
        id: string;
        userId: string;
        date: Date;
        shopName: string;
        totalAmount: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        note: string;
        imageUrl: string;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        items: {
            id: string;
            itemName: string;
            quantity: number;
            unit: import(".prisma/client").$Enums.Unit;
            price: number;
            totalPrice: number;
            note: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    findAll(): Promise<{
        id: string;
        userId: string;
        date: Date;
        shopName: string;
        totalAmount: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        note: string;
        imageUrl: string;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        items: {
            id: string;
            itemName: string;
            quantity: number;
            unit: import(".prisma/client").$Enums.Unit;
            price: number;
            totalPrice: number;
            note: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        userId: string;
        date: Date;
        shopName: string;
        totalAmount: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        note: string;
        imageUrl: string;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        items: {
            id: string;
            itemName: string;
            quantity: number;
            unit: import(".prisma/client").$Enums.Unit;
            price: number;
            totalPrice: number;
            note: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    findByUser(userId: string, startDate?: Date, endDate?: Date): Promise<{
        id: string;
        userId: string;
        date: Date;
        shopName: string;
        totalAmount: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        note: string;
        imageUrl: string;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        items: {
            id: string;
            itemName: string;
            quantity: number;
            unit: import(".prisma/client").$Enums.Unit;
            price: number;
            totalPrice: number;
            note: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }[]>;
    findByDate(date: Date): Promise<{
        id: string;
        userId: string;
        date: Date;
        shopName: string;
        totalAmount: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        note: string;
        imageUrl: string;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        items: {
            id: string;
            itemName: string;
            quantity: number;
            unit: import(".prisma/client").$Enums.Unit;
            price: number;
            totalPrice: number;
            note: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }[]>;
    getDailySummary(date: Date): Promise<{
        date: string;
        totalAmount: number;
        totalCash: number;
        totalDebt: number;
        totalSelf: number;
        totalItems: number;
        items: {
            id: string;
            userId: string;
            date: Date;
            shopName: string;
            totalAmount: number;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            note: string;
            imageUrl: string;
            createdAt: Date;
            updatedAt: Date;
            userName: string;
            items: {
                id: string;
                itemName: string;
                quantity: number;
                unit: import(".prisma/client").$Enums.Unit;
                price: number;
                totalPrice: number;
                note: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
        }[];
    }>;
    getMonthlySummary(year: number, month: number): Promise<{
        month: string;
        year: number;
        totalAmount: number;
        totalCash: number;
        totalDebt: number;
        totalSelf: number;
        totalItems: number;
        categorySummary: {
            itemName: string;
            totalAmount: number;
            count: number;
        }[];
        marketings: {
            id: string;
            userId: string;
            date: Date;
            shopName: string;
            totalAmount: number;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            note: string;
            imageUrl: string;
            createdAt: Date;
            updatedAt: Date;
            userName: string;
            items: {
                id: string;
                itemName: string;
                quantity: number;
                unit: import(".prisma/client").$Enums.Unit;
                price: number;
                totalPrice: number;
                note: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
        }[];
    }>;
    update(id: string, updateMarketingDto: UpdateMarketingDto, file?: any): Promise<{
        id: string;
        userId: string;
        date: Date;
        shopName: string;
        totalAmount: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        note: string;
        imageUrl: string;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        items: {
            id: string;
            itemName: string;
            quantity: number;
            unit: import(".prisma/client").$Enums.Unit;
            price: number;
            totalPrice: number;
            note: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeByDate(date: Date): Promise<{
        message: string;
        count: number;
    }>;
    private sendNotifications;
    private updateDailySummary;
}
