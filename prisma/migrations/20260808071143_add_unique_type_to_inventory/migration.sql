/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "InventoryLog" ADD COLUMN     "marketingId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_type_key" ON "Inventory"("type");

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_marketingId_fkey" FOREIGN KEY ("marketingId") REFERENCES "Marketing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
