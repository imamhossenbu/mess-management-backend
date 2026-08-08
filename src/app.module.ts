// src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { HealthModule } from "./modules/health";

@Module({
  imports: [
    // Config Module - Global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Prisma Module - Global
    PrismaModule,

    // Auth Module
    AuthModule,

     // Health Module
    HealthModule,

    // অন্যান্য মডিউল পরে যোগ করা হবে:
    // UsersModule,
    // MealsModule,
    // MarketingsModule,
    // InventoryModule,
    // UtilityBillsModule,
    // ShopDebtsModule,
    // PaymentsModule,
    // MonthlySummaryModule,
    // DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
