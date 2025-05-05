/*
  Warnings:

  - A unique constraint covering the columns `[predicted_name]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `predicted_name` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "predicted_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_predicted_name_key" ON "Recipe"("predicted_name");
