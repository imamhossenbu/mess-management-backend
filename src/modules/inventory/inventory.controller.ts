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
  InventoryResponseDto,
  InventoryLogResponseDto,
  InventorySummaryDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";
import { Role } from "../auth/dto/register.dto";
import { InventoryType } from "@prisma/client";
import { CurrentMess } from "../../common/current-mess.decorator";

@ApiTags("inventory")
@ApiBearerAuth("JWT-auth")
@Controller("inventory")
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getAll(@CurrentMess() messId: string) {
    return this.inventoryService.getAllInventory(messId);
  }

  @Get("summary")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getSummary(@CurrentMess() messId: string) {
    return this.inventoryService.getSummary(messId);
  }

  @Get("type/:type")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.MEMBER)
  async getByType(
    @CurrentMess() messId: string,
    @Param("type") type: InventoryType,
  ) {
    return this.inventoryService.getInventory(messId, type);
  }

  @Get("logs")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async getLogs(
    @CurrentMess() messId: string,
    @Query("type") type?: InventoryType,
  ) {
    return this.inventoryService.getLogs(messId, type);
  }

  @Get("check/:type")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async checkAvailability(
    @CurrentMess() messId: string,
    @Param("type") type: InventoryType,
    @Query("quantity") quantity: number,
  ) {
    return this.inventoryService.checkAvailability(messId, type, quantity);
  }

  @Post("add")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async add(
    @CurrentMess() messId: string,
    @Body() addInventoryDto: AddInventoryDto,
  ) {
    return this.inventoryService.addInventory(messId, addInventoryDto);
  }

  @Post("remove")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async remove(
    @CurrentMess() messId: string,
    @Body() removeInventoryDto: RemoveInventoryDto,
  ) {
    return this.inventoryService.removeInventory(messId, removeInventoryDto);
  }

  @Patch("set")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async set(
    @CurrentMess() messId: string,
    @Body() setInventoryDto: SetInventoryDto,
  ) {
    return this.inventoryService.setInventory(messId, setInventoryDto);
  }

  @Post("bulk-add")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async bulkAdd(
    @CurrentMess() messId: string,
    @Body()
    items: {
      type: InventoryType;
      quantity: number;
      marketingId?: string;
      note?: string;
    }[],
  ) {
    return this.inventoryService.bulkAdd(messId, items);
  }

  @Post("bulk-remove")
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async bulkRemove(
    @CurrentMess() messId: string,
    @Body() items: { type: InventoryType; quantity: number; note?: string }[],
  ) {
    return this.inventoryService.bulkRemove(messId, items);
  }
}
