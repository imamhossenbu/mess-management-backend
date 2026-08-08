-- AlterTable
ALTER TABLE "Mess" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "maxMembers" INTEGER NOT NULL DEFAULT 50;
