-- DropForeignKey
ALTER TABLE "DailyIntakeLog" DROP CONSTRAINT "DailyIntakeLog_scanId_fkey";

-- DropForeignKey
ALTER TABLE "OpenAIResponse" DROP CONSTRAINT "OpenAIResponse_scanId_fkey";

-- DropForeignKey
ALTER TABLE "Scan" DROP CONSTRAINT "Scan_recipeId_fkey";

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyIntakeLog" ADD CONSTRAINT "DailyIntakeLog_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenAIResponse" ADD CONSTRAINT "OpenAIResponse_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
