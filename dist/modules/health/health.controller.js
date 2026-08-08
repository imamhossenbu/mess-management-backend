"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../../prisma/prisma.service");
let HealthController = class HealthController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async healthCheck() {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            service: "mess-management-api",
            version: "1.0.0",
        };
    }
    async ping() {
        return {
            message: "pong",
            timestamp: new Date().toISOString(),
        };
    }
    async dbHealth() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return {
                status: "ok",
                database: "connected",
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: "error",
                database: "disconnected",
                error: error?.message || "Unknown error occurred",
                timestamp: new Date().toISOString(),
            };
        }
    }
    async readiness() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return {
                status: "ready",
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: "not ready",
                error: error?.message || "Unknown error occurred",
                timestamp: new Date().toISOString(),
            };
        }
    }
    async liveness() {
        return {
            status: "alive",
            timestamp: new Date().toISOString(),
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Health check endpoint" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Server is healthy" }),
    (0, swagger_1.ApiResponse)({ status: 503, description: "Service unavailable" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)("ping"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Simple ping endpoint" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Pong" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "ping", null);
__decorate([
    (0, common_1.Get)("db"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Database health check" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Database is healthy" }),
    (0, swagger_1.ApiResponse)({ status: 503, description: "Database connection failed" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "dbHealth", null);
__decorate([
    (0, common_1.Get)("ready"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Readiness check for Kubernetes/Deployment" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Service is ready" }),
    (0, swagger_1.ApiResponse)({ status: 503, description: "Service is not ready" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "readiness", null);
__decorate([
    (0, common_1.Get)("live"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Liveness check for Kubernetes/Deployment" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Service is alive" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "liveness", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)("health"),
    (0, common_1.Controller)("health"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map