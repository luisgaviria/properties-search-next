/*
  Warnings:

  - You are about to drop the column `data` on the `Search` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Search" DROP COLUMN "data",
ADD COLUMN     "baths" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "beds" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "near" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "price_range_from" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "price_range_to" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subtype" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT '';
