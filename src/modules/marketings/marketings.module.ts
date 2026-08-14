// src/modules/marketings/marketings.module.ts
import { Module } from "@nestjs/common";
import { MarketingsService } from "./marketings.service";
import { MarketingsController } from "./marketings.controller";
import { NotificationsModule } from "../notifications/notifications.module";
import { CloudinaryModule } from "../cloudinary/cloudinary.module"; // ✅ Add this

@Module({
  imports: [
    NotificationsModule,
    CloudinaryModule, // ✅ Import CloudinaryModule
  ],
  controllers: [MarketingsController],
  providers: [MarketingsService],
  exports: [MarketingsService],
})
export class MarketingsModule {}
