/*
  Warnings:

  - A unique constraint covering the columns `[monthYear]` on the table `ShopMonthlySummary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ShopMonthlySummary_monthYear_key" ON "ShopMonthlySummary"("monthYear");
