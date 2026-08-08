// src/modules/inventory/inventory.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Patch,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { InventoryService } from "./inventory.service";
import {
  AddInventoryDto,
  RemoveInventoryDto,
  SetInventoryDto,
  InventoryResponseDto,
  InventoryLogResponseDto,
  InventorySummaryDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../auth/dto/register.dto";
import { InventoryType } from "@prisma/client";
import { Roles } from "src/common/roles.decorator";

@ApiTags("inventory")
@ApiSecurity("JWT-auth")
@Controller("inventory")
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get all inventory" })
  @ApiResponse({
    status: 200,
    description: "List of all inventory",
    type: [InventoryResponseDto],
  })
  async getAll() {
    return this.inventoryService.getAllInventory();
  }

  @Get("summary")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get inventory summary (meat + fish)" })
  @ApiResponse({
    status: 200,
    description: "Inventory summary",
    type: InventorySummaryDto,
  })
  async getSummary() {
    return this.inventoryService.getSummary();
  }

  @Get("type/:type")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({ summary: "Get inventory by type" })
  @ApiParam({ name: "type", enum: InventoryType })
  @ApiResponse({
    status: 200,
    description: "Inventory found",
    type: InventoryResponseDto,
  })
  async getByType(@Param("type") type: InventoryType) {
    return this.inventoryService.getInventory(type);
  }

  @Get("logs")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Get inventory logs" })
  @ApiQuery({ name: "type", enum: InventoryType, required: false })
  @ApiResponse({
    status: 200,
    description: "Inventory logs",
    type: [InventoryLogResponseDto],
  })
  async getLogs(@Query("type") type?: InventoryType) {
    return this.inventoryService.getLogs(type);
  }

  @Get("check/:type")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Check inventory availability" })
  @ApiParam({ name: "type", enum: InventoryType })
  @ApiQuery({ name: "quantity", type: Number, example: 5 })
  async checkAvailability(
    @Param("type") type: InventoryType,
    @Query("quantity") quantity: number,
  ) {
    return this.inventoryService.checkAvailability(type, quantity);
  }

  @Post("add")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Add inventory (বাজার করলে)" })
  @ApiResponse({
    status: 201,
    description: "Inventory added successfully",
    type: InventoryResponseDto,
  })
  async add(@Body() addInventoryDto: AddInventoryDto) {
    return this.inventoryService.addInventory(addInventoryDto);
  }

  @Post("remove")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Remove inventory (রান্নায় ব্যবহার করলে)" })
  @ApiResponse({
    status: 201,
    description: "Inventory removed successfully",
    type: InventoryResponseDto,
  })
  async remove(@Body() removeInventoryDto: RemoveInventoryDto) {
    return this.inventoryService.removeInventory(removeInventoryDto);
  }

  @Patch("set")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Set inventory manually (স্টক চেক করে আপডেট)" })
  @ApiResponse({
    status: 200,
    description: "Inventory set successfully",
    type: InventoryResponseDto,
  })
  async set(@Body() setInventoryDto: SetInventoryDto) {
    return this.inventoryService.setInventory(setInventoryDto);
  }

  @Post("bulk-add")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Bulk add inventory" })
  async bulkAdd(
    @Body()
    items: {
      type: InventoryType;
      quantity: number;
      marketingId?: string;
      note?: string;
    }[],
  ) {
    return this.inventoryService.bulkAdd(items);
  }

  @Post("bulk-remove")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: "Bulk remove inventory" })
  async bulkRemove(
    @Body() items: { type: InventoryType; quantity: number; note?: string }[],
  ) {
    return this.inventoryService.bulkRemove(items);
  }
}
