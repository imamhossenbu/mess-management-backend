"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Mess Management System API")
        .setDescription("Complete API documentation for Mess Management System")
        .setVersion("1.0")
        .addSecurity("JWT-auth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    })
        .addTag("auth", "Authentication endpoints")
        .addTag("users", "User management endpoints")
        .addTag("meals", "Meal management endpoints")
        .addTag("health", "Health check endpoints")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api-docs", app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: "alpha",
            operationsSorter: "alpha",
        },
    });
    const port = process.env.PORT || 5001;
    await app.listen(port, () => {
        console.log(`🚀 Application is running on: http://localhost:${port}`);
        console.log(`📚 Swagger documentation: http://localhost:${port}/api-docs`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map