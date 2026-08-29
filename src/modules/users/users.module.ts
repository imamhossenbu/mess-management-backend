// src/modules/users/users.module.ts
import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { NotificationsModule } from "../notifications/notifications.module"; // ✅ Import
import { DashboardModule } from "../dashboard/dashboard.module";

@Module({
  imports: [
    CloudinaryModule,
    NotificationsModule,
    DashboardModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
