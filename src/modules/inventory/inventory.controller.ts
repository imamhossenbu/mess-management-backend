// src/modules/inventory/inventory.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { InventoryService } from "./inventory.service";
import {
  AddInventoryDto,
  RemoveInventoryDto,
  SetInventoryDto,
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  InventoryItemResponseDto,
  InventoryLogResponseDto,
  InventorySummaryDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";
import { InventoryCategory } from "@prisma/client";

@ApiTags("inventory")
@ApiBearerAuth("JWT-auth")
@Controller("inventory")
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get all inventory items grouped by category" })
  async getAll() {
    return this.inventoryService.getAllInventory();
  }

  @Get("summary")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get inventory summary" })
  async getSummary() {
    return this.inventoryService.getSummary();
  }

  @Get("category/:category")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get inventory by category" })
  async getByCategory(@Param("category") category: InventoryCategory) {
    return this.inventoryService.getByCategory(category);
  }

  @Get("item/:name")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get single inventory item" })
  async getInventoryItem(@Param("name") name: string) {
    return this.inventoryService.getInventoryItem(name);
  }

  @Get("logs")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Get stock logs" })
  async getStockLogs(@Query("itemName") itemName?: string) {
    return this.inventoryService.getStockLogs(itemName);
  }

  @Get("check/:name")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Check inventory availability" })
  async checkAvailability(
    @Param("name") name: string,
    @Query("quantity") quantity: number,
  ) {
    return this.inventoryService.checkAvailability(name, quantity);
  }

  @Post("items")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Create new inventory item" })
  async createInventoryItem(@Body() dto: CreateInventoryItemDto) {
    return this.inventoryService.createInventoryItem(dto);
  }

  @Patch("items/:name")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Update inventory item" })
  async updateInventoryItem(
    @Param("name") name: string,
    @Body() dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.updateInventoryItem(name, dto);
  }

  @Post("add")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Add inventory (increase stock)" })
  async addInventory(@Body() dto: AddInventoryDto) {
    return this.inventoryService.addInventory(dto);
  }

  @Post("remove")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Remove inventory (decrease stock)" })
  async removeInventory(@Body() dto: RemoveInventoryDto) {
    return this.inventoryService.removeInventory(dto);
  }

  @Post("set")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Set inventory manually" })
  async setInventory(@Body() dto: SetInventoryDto) {
    return this.inventoryService.setInventory(dto);
  }

  @Delete("items/:name")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Delete inventory item" })
  async deleteInventoryItem(@Param("name") name: string) {
    // This would delete the item and all its logs
    // Implementation depends on your business logic
  }
}
