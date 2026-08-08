// src/modules/meals/meals.module.ts
import { Module } from "@nestjs/common";
import { MealsService } from "./meals.service";
import { MealsController } from "./meals.controller";
import { NotificationsModule } from "../notifications/notifications.module"; // ✅ Import

@Module({
  imports: [NotificationsModule], // ✅ Add
  controllers: [MealsController],
  providers: [MealsService],
  exports: [MealsService],
})
export class MealsModule {}
