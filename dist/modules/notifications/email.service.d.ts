import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
export declare class EmailService {
    private readonly config;
    private readonly prisma;
    private readonly logger;
    constructor(config: ConfigService, prisma: PrismaService);
    sendCredentials(user: {
        id: string;
        name: string;
        email: string;
    }, password: string): Promise<{
        sent: boolean;
        error?: undefined;
    } | {
        sent: boolean;
        error: string;
    }>;
    sendBillEmail(user: {
        id: string;
        name: string;
        email: string;
    }, billAmount: number, dueDate: Date, month: string, details?: {
        mealBill: number;
        utilityShare: number;
        totalBill: number;
        totalPaid: number;
        currentDue: number;
    }): Promise<{
        sent: boolean;
        error?: undefined;
    } | {
        sent: boolean;
        error: string;
    }>;
    sendEmailWithHtml(to: string, subject: string, text: string, html: string): Promise<{
        sent: boolean;
        error?: undefined;
    } | {
        sent: boolean;
        error: string;
    }>;
}
