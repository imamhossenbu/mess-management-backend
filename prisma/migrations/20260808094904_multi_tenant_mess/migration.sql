/*
  Warnings:

  - You are about to drop the column `userId` on the `Marketing` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `MonthlySummary` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `joinedDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `leftDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roomNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserBalance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[messId,date]` on the table `DailySummary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[messId,type]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[memberId,date]` on the table `Meal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[memberId,monthYear]` on the table `MonthlySummary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[messId,monthYear]` on the table `ShopMonthlySummary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[memberId]` on the table `UserBalance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `messId` to the `CarryForward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messId` to the `DailySummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messId` to the `InventoryLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `Marketing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messId` to the `Marketing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messId` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `MonthlySummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messId` to the `MonthlySummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messId` to the `ShopDebt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messId` to the `ShopMonthlySummary` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `memberId` to the `UserBalance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messId` to the `UtilityBill` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "Marketing" DROP CONSTRAINT "Marketing_userId_fkey";

-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_userId_fkey";

-- DropForeignKey
ALTER TABLE "MonthlySummary" DROP CONSTRAINT "MonthlySummary_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserBalance" DROP CONSTRAINT "UserBalance_userId_fkey";

-- DropIndex
DROP INDEX "DailySummary_date_key";

-- DropIndex
DROP INDEX "Inventory_type_key";

-- DropIndex
DROP INDEX "Meal_userId_date_key";

-- DropIndex
DROP INDEX "MonthlySummary_userId_monthYear_key";

-- DropIndex
DROP INDEX "ShopMonthlySummary_monthYear_key";

-- DropIndex
DROP INDEX "UserBalance_userId_key";

-- AlterTable
ALTER TABLE "CarryForward" ADD COLUMN     "messId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DailySummary" ADD COLUMN     "messId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "messId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InventoryLog" ADD COLUMN     "messId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Marketing" DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL,
ADD COLUMN     "messId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL,
ADD COLUMN     "messId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MonthlySummary" DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL,
ADD COLUMN     "messId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL,
ADD COLUMN     "messId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShopDebt" ADD COLUMN     "messId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShopMonthlySummary" ADD COLUMN     "messId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "joinedDate",
DROP COLUMN "leftDate",
DROP COLUMN "role",
DROP COLUMN "roomNumber",
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserBalance" DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UtilityBill" ADD COLUMN     "messId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Mess" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "logo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messId" TEXT NOT NULL,
    "role" "MessRole" NOT NULL DEFAULT 'MEMBER',
    "joinedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mess_slug_key" ON "Mess"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MessMember_userId_messId_key" ON "MessMember"("userId", "messId");

-- CreateIndex
CREATE UNIQUE INDEX "DailySummary_messId_date_key" ON "DailySummary"("messId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_messId_type_key" ON "Inventory"("messId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Meal_memberId_date_key" ON "Meal"("memberId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlySummary_memberId_monthYear_key" ON "MonthlySummary"("memberId", "monthYear");

-- CreateIndex
CREATE UNIQUE INDEX "ShopMonthlySummary_messId_monthYear_key" ON "ShopMonthlySummary"("messId", "monthYear");

-- CreateIndex
CREATE UNIQUE INDEX "UserBalance_memberId_key" ON "UserBalance"("memberId");

-- AddForeignKey
ALTER TABLE "MessMember" ADD CONSTRAINT "MessMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessMember" ADD CONSTRAINT "MessMember_messId_fkey" FOREIGN KEY ("messId") REFERENCES "Mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MessMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_messId_fkey" FOREIGN KEY ("messId") REFERENCES "Mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MessMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marketing" ADD CONSTRAINT "Marketing_messId_fkey" FOREIGN KEY ("messId") REFERENCES "Mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marketing" ADD CONSTRAINT "Marketing_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MessMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_messId_fkey" FOREIGN KEY ("messId") REFERENCES "Mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_messId_fkey" FOREIGN KEY ("messId") REFERENCES "Mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UtilityBill" ADD CONSTRAINT "UtilityBill_messId_fkey" FOREIGN KEY ("messId") REFERENCES "Mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopDebt" ADD CONSTRAINT "ShopDebt_messId_fkey" FOREIGN KEY ("messId") REFERENCES "Mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopMonthlySummary" ADD CONSTRAINT "ShopMonthlySummary_messId_fkey" FOREIGN KEY ("messId") REFERENCES "Mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarryForward" ADD CONSTRAINT "CarryForward_messId_fkey" FOREIGN KEY ("messId") REFERENCES "Mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_messId_fkey" FOREIGN KEY ("messId") REFERENCES "Mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MessMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlySummary" ADD CONSTRAINT "MonthlySummary_messId_fkey" FOREIGN KEY ("messId") REFERENCES "Mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlySummary" ADD CONSTRAINT "MonthlySummary_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MessMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailySummary" ADD CONSTRAINT "DailySummary_messId_fkey" FOREIGN KEY ("messId") REFERENCES "Mess"("id") ON DELETE CASCADE ON UPDATE CASCADE;
