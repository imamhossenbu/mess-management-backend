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
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
let CloudinaryService = class CloudinaryService {
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get("CLOUDINARY_CLOUD_NAME"),
            api_key: this.configService.get("CLOUDINARY_API_KEY"),
            api_secret: this.configService.get("CLOUDINARY_API_SECRET"),
        });
    }
    async uploadProfileImage(file, userId) {
        try {
            const allowedMimeTypes = [
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/webp",
            ];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new common_1.BadRequestException("Only JPEG, PNG, GIF, and WEBP images are allowed");
            }
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                throw new common_1.BadRequestException("File size must be less than 5MB");
            }
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder: `mess-management/profiles/${userId}`,
                    public_id: `profile-${userId}`,
                    overwrite: true,
                    transformation: [
                        { width: 400, height: 400, crop: "fill", gravity: "face" },
                        { quality: "auto" },
                    ],
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                const Readable = require("stream").Readable;
                const readableStream = new Readable();
                readableStream.push(file.buffer);
                readableStream.push(null);
                readableStream.pipe(uploadStream);
            });
            return result.secure_url;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to upload image: ${error?.message || "Unknown error"}`);
        }
    }
    async deleteProfileImage(imageUrl) {
        try {
            if (!imageUrl)
                return false;
            const urlParts = imageUrl.split("/");
            const fileName = urlParts[urlParts.length - 1];
            const publicId = `mess-management/profiles/${fileName.split(".")[0]}`;
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            return result.result === "ok";
        }
        catch (error) {
            console.error("Error deleting image from Cloudinary:", error?.message || "Unknown error");
            return false;
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map