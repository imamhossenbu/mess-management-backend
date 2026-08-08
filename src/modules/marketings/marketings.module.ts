// src/modules/marketings/marketings.module.ts
import { Module } from "@nestjs/common";
import { MarketingsService } from "./marketings.service";
import { MarketingsController } from "./marketings.controller";
import { InventoryModule } from "../inventory/inventory.module";

@Module({
  imports: [InventoryModule],
  controllers: [MarketingsController],
  providers: [MarketingsService],
  exports: [MarketingsService],
})
export class MarketingsModule {}
