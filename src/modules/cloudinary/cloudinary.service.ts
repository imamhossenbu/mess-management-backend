// src/modules/cloudinary/cloudinary.service.ts
import { Injectable, BadRequestException } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { ConfigService } from "@nestjs/config";
import * as stream from "stream";

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get("CLOUDINARY_CLOUD_NAME"),
      api_key: this.configService.get("CLOUDINARY_API_KEY"),
      api_secret: this.configService.get("CLOUDINARY_API_SECRET"),
    });
  }

  // ==================== PROFILE IMAGE ====================

  async uploadProfileImage(file: any, userId: string): Promise<string> {
    try {
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          "Only JPEG, PNG, GIF, and WEBP images are allowed",
        );
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new BadRequestException("File size must be less than 5MB");
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `mess-management/profiles/${userId}`,
            public_id: `profile-${userId}`,
            overwrite: true,
            transformation: [
              { width: 400, height: 400, crop: "fill", gravity: "face" },
              { quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        const Readable = require("stream").Readable;
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });

      return (result as any).secure_url;
    } catch (error: any) {
      throw new BadRequestException(
        `Failed to upload profile image: ${error?.message || "Unknown error"}`,
      );
    }
  }

  async deleteProfileImage(imageUrl: string): Promise<boolean> {
    try {
      if (!imageUrl) return false;

      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const publicId = `mess-management/profiles/${fileName.split(".")[0]}`;

      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch (error: any) {
      console.error(
        "Error deleting profile image from Cloudinary:",
        error?.message || "Unknown error",
      );
      return false;
    }
  }

  // ==================== BAZAR / GENERAL IMAGE ====================

  async uploadFile(file: any, folder: string): Promise<string> {
    try {
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/heic",
        "image/svg+xml",
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          "Only JPEG, PNG, GIF, WEBP, HEIC, and SVG images are allowed",
        );
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new BadRequestException("File size must be less than 10MB");
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `mess-management/${folder}`,
            overwrite: true,
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto:good" },
            ],
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(uploadStream);
      });

      return (result as any).secure_url;
    } catch (error: any) {
      throw new BadRequestException(
        `Failed to upload image: ${error?.message || "Unknown error"}`,
      );
    }
  }

  async deleteFile(imageUrl: string): Promise<boolean> {
    try {
      if (!imageUrl) return false;

      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      // Remove extension
      const publicId = `mess-management/${fileName.split(".")[0]}`;

      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch (error: any) {
      console.error(
        "Error deleting image from Cloudinary:",
        error?.message || "Unknown error",
      );
      return false;
    }
  }

  // ==================== DELETE ANY IMAGE ====================

  async deleteImage(
    imageUrl: string,
    type: "profile" | "bazar" = "bazar",
  ): Promise<boolean> {
    try {
      if (!imageUrl) return false;

      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const publicId = `mess-management/${type === "profile" ? "profiles" : ""}/${fileName.split(".")[0]}`;

      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch (error: any) {
      console.error("Error deleting image:", error?.message || "Unknown error");
      return false;
    }
  }
}
