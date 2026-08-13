// src/modules/marketings/marketings.module.ts
import { Module } from "@nestjs/common";
import { MarketingsService } from "./marketings.service";
import { MarketingsController } from "./marketings.controller";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [NotificationsModule],
  controllers: [MarketingsController],
  providers: [MarketingsService],
  exports: [MarketingsService],
})
export class MarketingsModule {}
