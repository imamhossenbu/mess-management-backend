// src/modules/monthly-summary/monthly-summary.module.ts
import { Module } from "@nestjs/common";
import { MonthlySummaryService } from "./monthly-summary.service";
import { MonthlySummaryController } from "./monthly-summary.controller";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [NotificationsModule],
  controllers: [MonthlySummaryController],
  providers: [MonthlySummaryService],
  exports: [MonthlySummaryService],
})
export class MonthlySummaryModule {}
