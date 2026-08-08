// src/modules/utility-bills/utility-bills.module.ts
import { Module } from "@nestjs/common";
import { UtilityBillsService } from "./utility-bills.service";
import { UtilityBillsController } from "./utility-bills.controller";
import { NotificationsModule } from "../notifications/notifications.module"; // ✅ Import

@Module({
  imports: [NotificationsModule], // ✅ Add
  controllers: [UtilityBillsController],
  providers: [UtilityBillsService],
  exports: [UtilityBillsService],
})
export class UtilityBillsModule {}
