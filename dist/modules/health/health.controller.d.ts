import { PrismaService } from "../../prisma/prisma.service";
export declare class HealthController {
    private prisma;
    constructor(prisma: PrismaService);
    healthCheck(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        service: string;
        version: string;
    }>;
    ping(): Promise<{
        message: string;
        timestamp: string;
    }>;
    dbHealth(): Promise<{
        status: string;
        database: string;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        database: string;
        error: any;
        timestamp: string;
    }>;
    readiness(): Promise<{
        status: string;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        error: any;
        timestamp: string;
    }>;
    liveness(): Promise<{
        status: string;
        timestamp: string;
    }>;
}
