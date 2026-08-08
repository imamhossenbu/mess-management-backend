// src/modules/utility-bills/utility-bills.module.ts
import { Module } from "@nestjs/common";
import { UtilityBillsService } from "./utility-bills.service";
import { UtilityBillsController } from "./utility-bills.controller";

@Module({
  controllers: [UtilityBillsController],
  providers: [UtilityBillsService],
  exports: [UtilityBillsService],
})
export class UtilityBillsModule {}
