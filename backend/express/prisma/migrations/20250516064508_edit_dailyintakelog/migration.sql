/*
  Warnings:

  - You are about to drop the column `mealType` on the `DailyIntakeLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyIntakeLog" DROP COLUMN "mealType",
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
