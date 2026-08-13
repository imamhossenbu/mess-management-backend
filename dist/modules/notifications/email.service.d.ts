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
    }, password: string, messName: string): Promise<{
        sent: boolean;
    }>;
}
