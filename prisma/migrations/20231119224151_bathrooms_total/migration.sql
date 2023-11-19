/*
  Warnings:

  - You are about to drop the column `BathroomsTotalDecimalFrom` on the `Search` table. All the data in the column will be lost.
  - You are about to drop the column `BathroomsTotalDecimalTo` on the `Search` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Search" DROP COLUMN "BathroomsTotalDecimalFrom",
DROP COLUMN "BathroomsTotalDecimalTo",
ADD COLUMN     "BathroomsTotal" TEXT NOT NULL DEFAULT '';
