// src/modules/dashboard/dashboard.module.ts
import { Module } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import { NotificationsModule } from "../notifications/notifications.module"; // ✅ Import

@Module({
  imports: [NotificationsModule], // ✅ Add
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
