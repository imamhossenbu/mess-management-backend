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
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
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

  // ==================== GET ALL - সবাই দেখতে পারে ====================

  @Get()
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get all inventory items grouped by category" })
  async getAll() {
    return this.inventoryService.getAllInventory();
  }

  // ==================== GET SUMMARY - সবাই দেখতে পারে ====================

  @Get("summary")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get inventory summary" })
  async getSummary() {
    return this.inventoryService.getSummary();
  }

  // ==================== GET BY CATEGORY - সবাই দেখতে পারে ====================

  @Get("category/:category")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get inventory by category" })
  @ApiParam({ name: "category", enum: InventoryCategory })
  async getByCategory(@Param("category") category: InventoryCategory) {
    return this.inventoryService.getByCategory(category);
  }

  // ==================== GET SINGLE ITEM - সবাই দেখতে পারে ====================

  @Get("item/:name")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get single inventory item" })
  @ApiParam({ name: "name", description: "Item name" })
  async getInventoryItem(@Param("name") name: string) {
    return this.inventoryService.getInventoryItem(name);
  }

  // ==================== GET LOGS - সবাই দেখতে পারে ====================

  @Get("logs")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get stock logs" })
  @ApiQuery({ name: "itemName", required: false, type: String })
  async getStockLogs(@Query("itemName") itemName?: string) {
    return this.inventoryService.getStockLogs(itemName);
  }

  // ==================== CHECK AVAILABILITY - সবাই করতে পারে ====================

  @Get("check/:name")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Check inventory availability" })
  @ApiQuery({ name: "quantity", type: Number })
  async checkAvailability(
    @Param("name") name: string,
    @Query("quantity") quantity: number,
  ) {
    return this.inventoryService.checkAvailability(name, quantity);
  }

  // ==================== CREATE ITEM - সবাই করতে পারে ====================

  @Post("items")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Create new inventory item" })
  async createInventoryItem(@Body() dto: CreateInventoryItemDto) {
    return this.inventoryService.createInventoryItem(dto);
  }

  // ==================== UPDATE ITEM - সবাই করতে পারে ====================

  @Patch("items/:name")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Update inventory item" })
  @ApiParam({ name: "name", description: "Item name" })
  async updateInventoryItem(
    @Param("name") name: string,
    @Body() dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.updateInventoryItem(name, dto);
  }

  // ==================== ADD INVENTORY - সবাই করতে পারে ====================

  @Post("add")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Add inventory (increase stock)" })
  async addInventory(@Body() dto: AddInventoryDto) {
    return this.inventoryService.addInventory(dto);
  }

  // ==================== REMOVE INVENTORY - সবাই করতে পারে ====================

  @Post("remove")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Remove inventory (decrease stock)" })
  async removeInventory(@Body() dto: RemoveInventoryDto) {
    return this.inventoryService.removeInventory(dto);
  }

  // ==================== SET INVENTORY - সবাই করতে পারে ====================

  @Post("set")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Set inventory manually" })
  async setInventory(@Body() dto: SetInventoryDto) {
    return this.inventoryService.setInventory(dto);
  }

  // ==================== DELETE ITEM - সবাই করতে পারে ====================

  @Delete("items/:name")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete inventory item" })
  @ApiParam({ name: "name", description: "Item name" })
  async deleteInventoryItem(@Param("name") name: string) {
    return this.inventoryService.deleteInventoryItem(name);
  }
}
