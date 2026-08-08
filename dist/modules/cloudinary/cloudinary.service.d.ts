import { ConfigService } from "@nestjs/config";
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadProfileImage(file: any, userId: string): Promise<string>;
    deleteProfileImage(imageUrl: string): Promise<boolean>;
}
