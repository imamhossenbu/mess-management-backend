// src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { MealsModule } from "./modules/meals/meals.module";
import { HealthModule } from "./modules/health/health.module";
import { CloudinaryModule } from "./modules/cloudinary/cloudinary.module";

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
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
