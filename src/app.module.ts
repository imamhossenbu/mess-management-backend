// src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { MealsModule } from "./modules/meals/meals.module";
import { HealthModule } from "./modules/health/health.module";
import { CloudinaryModule } from "./modules/cloudinary/cloudinary.module";
import { MarketingsModule } from "./modules/marketings/marketings.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { UtilityBillsModule } from "./modules/utility-bills/utility-bills.module";
import { ShopDebtsModule } from "./modules/shop-debts/shop-debts.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { MonthlySummaryModule } from "./modules/monthly-summary/monthly-summary.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    PrismaModule,
    CloudinaryModule,
    AuthModule,
    UsersModule,
    MealsModule,
    MarketingsModule,
    InventoryModule,
    UtilityBillsModule,
    ShopDebtsModule,
    PaymentsModule,
    MonthlySummaryModule,
    DashboardModule,
     NotificationsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
