/*
  Warnings:

  - You are about to drop the column `baths` on the `Search` table. All the data in the column will be lost.
  - You are about to drop the column `beds` on the `Search` table. All the data in the column will be lost.
  - You are about to drop the column `price_range_from` on the `Search` table. All the data in the column will be lost.
  - You are about to drop the column `price_range_to` on the `Search` table. All the data in the column will be lost.
  - You are about to drop the column `subtype` on the `Search` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Search` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Search" DROP COLUMN "baths",
DROP COLUMN "beds",
DROP COLUMN "price_range_from",
DROP COLUMN "price_range_to",
DROP COLUMN "subtype",
DROP COLUMN "type",
ADD COLUMN     "BathroomsTotalDecimalFrom" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "BathroomsTotalDecimalTo" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "BedroomsTotal" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "City" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ListPriceFrom" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ListPriceTo" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "PropertySubType" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "PropertyType" TEXT NOT NULL DEFAULT '';
