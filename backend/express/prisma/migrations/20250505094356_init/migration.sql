/*
  Warnings:

  - You are about to drop the column `badgeKeys` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "badgeKeys",
ADD COLUMN     "tips" TEXT[];

-- CreateTable
CREATE TABLE "BadgeKeys" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "badgeKeys" TEXT NOT NULL,

    CONSTRAINT "BadgeKeys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BadgeKeys_recipeId_key" ON "BadgeKeys"("recipeId");

-- AddForeignKey
ALTER TABLE "BadgeKeys" ADD CONSTRAINT "BadgeKeys_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
