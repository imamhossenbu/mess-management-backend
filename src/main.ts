// src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle("Mess Management System API")
    .setDescription("Complete API documentation for Mess Management System")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth", "Authentication endpoints")
    .addTag("users", "User management endpoints")
    .addTag("meals", "Meal management endpoints")
    .addTag("marketings", "Marketing/Bazar management endpoints")
    .addTag("inventory", "Inventory management endpoints")
    .addTag("utility-bills", "Utility bills management endpoints")
    .addTag("shop-debts", "Shop debt management endpoints")
    .addTag("payments", "Payment management endpoints")
    .addTag("monthly-summary", "Monthly summary endpoints")
    .addTag("dashboard", "Dashboard analytics endpoints")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  // Global prefix (optional)
  // app.setGlobalPrefix('api');

  const port = process.env.PORT || 5001;
  await app.listen(port, () => {
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api-docs`);
    console.log(`🔐 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}
bootstrap();
