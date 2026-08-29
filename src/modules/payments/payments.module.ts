// src/modules/payments/payments.module.ts
import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { NotificationsModule } from "../notifications/notifications.module";
import { DashboardModule } from "../dashboard/dashboard.module";

@Module({
  imports: [NotificationsModule, DashboardModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
