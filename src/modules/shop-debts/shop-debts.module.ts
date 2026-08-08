// src/modules/shop-debts/shop-debts.module.ts
import { Module } from "@nestjs/common";
import { ShopDebtsService } from "./shop-debts.service";
import { ShopDebtsController } from "./shop-debts.controller";

@Module({
  controllers: [ShopDebtsController],
  providers: [ShopDebtsService],
  exports: [ShopDebtsService],
})
export class ShopDebtsModule {}
