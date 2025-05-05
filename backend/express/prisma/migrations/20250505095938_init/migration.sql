/*
  Warnings:

  - You are about to drop the `BadgeKeys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BadgeKeys" DROP CONSTRAINT "BadgeKeys_recipeId_fkey";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "badgeKeys" TEXT[];

-- DropTable
DROP TABLE "BadgeKeys";
