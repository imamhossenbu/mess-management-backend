// src/modules/health/health.controller.ts
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PrismaService } from "../../prisma/prisma.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Health check endpoint" })
  @ApiResponse({ status: 200, description: "Server is healthy" })
  @ApiResponse({ status: 503, description: "Service unavailable" })
  async healthCheck() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: "mess-management-api",
      version: "1.0.0",
    };
  }

  @Get("ping")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Simple ping endpoint" })
  @ApiResponse({ status: 200, description: "Pong" })
  async ping() {
    return {
      message: "pong",
      timestamp: new Date().toISOString(),
    };
  }

  @Get("db")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Database health check" })
  @ApiResponse({ status: 200, description: "Database is healthy" })
  @ApiResponse({ status: 503, description: "Database connection failed" })
  async dbHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: "error",
        database: "disconnected",
        error: error?.message || "Unknown error occurred",
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get("ready")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Readiness check for Kubernetes/Deployment" })
  @ApiResponse({ status: 200, description: "Service is ready" })
  @ApiResponse({ status: 503, description: "Service is not ready" })
  async readiness() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: "ready",
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: "not ready",
        error: error?.message || "Unknown error occurred",
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get("live")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Liveness check for Kubernetes/Deployment" })
  @ApiResponse({ status: 200, description: "Service is alive" })
  async liveness() {
    return {
      status: "alive",
      timestamp: new Date().toISOString(),
    };
  }
}
