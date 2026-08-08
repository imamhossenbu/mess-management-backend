// src/modules/payments/payments.module.ts
import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { NotificationsModule } from "../notifications/notifications.module"; // ✅ Import

@Module({
  imports: [NotificationsModule], // ✅ Add
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
