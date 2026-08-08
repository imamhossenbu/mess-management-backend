// src/modules/mess/mess.module.ts
import { Module } from "@nestjs/common";
import { MessService } from "./mess.service";
import { MessController } from "./mess.controller";
import { NotificationsModule } from "../notifications/notifications.module"; // ✅ Import this

@Module({
  imports: [NotificationsModule], // ✅ Add this
  controllers: [MessController],
  providers: [MessService],
  exports: [MessService],
})
export class MessModule {}
