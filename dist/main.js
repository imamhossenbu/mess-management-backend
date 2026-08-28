"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://mess-management-frontend-cf7l.onrender.com",
        ],
        credentials: true,
        methods: [
            "GET",
            "HEAD",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Mess-Id",
            "Cache-Control",
            "Accept",
            "Origin",
            "X-Requested-With",
        ],
        exposedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Mess Management System API")
        .setDescription("Complete API documentation for Mess Management System")
        .setVersion("1.0")
        .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
    }, "JWT-auth")
        .addTag("auth", "Authentication endpoints")
        .addTag("users", "User management endpoints")
        .addTag("meals", "Meal management endpoints")
        .addTag("marketings", "Marketing/Bazar management endpoints")
        .addTag("inventory", "Inventory management endpoints")
        .addTag("utility-bills", "Utility bills management endpoints")
        .addTag("payments", "Payment management endpoints")
        .addTag("shop-debts", "Shop debt management endpoints")
        .addTag("monthly-summary", "Monthly summary endpoints")
        .addTag("dashboard", "Dashboard analytics endpoints")
        .addTag("notifications", "Notification management endpoints")
        .addTag("health", "Health check endpoints")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api-docs", app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    const port = process.env.PORT || 5001;
    await app.listen(port, "0.0.0.0", () => {
        console.log(`🚀 Application is running on port ${port}`);
        console.log(`📚 Swagger documentation available at /api-docs`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map