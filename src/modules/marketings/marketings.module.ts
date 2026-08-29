// src/modules/marketings/marketings.module.ts
import { Module } from "@nestjs/common";
import { MarketingsService } from "./marketings.service";
import { MarketingsController } from "./marketings.controller";
import { NotificationsModule } from "../notifications/notifications.module";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { PaymentsModule } from "../payments/payments.module";

@Module({
  imports: [
    NotificationsModule,
    CloudinaryModule,
    PaymentsModule,
  ],
  controllers: [MarketingsController],
  providers: [MarketingsService],
  exports: [MarketingsService],
})
export class MarketingsModule {}
