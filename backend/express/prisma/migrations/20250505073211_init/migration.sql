-- CreateEnum
CREATE TYPE "ScanMode" AS ENUM ('default', 'vision');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "scanCreditsRemaining" INTEGER NOT NULL DEFAULT 5,
    "weightGoal" DOUBLE PRECISION,
    "calorieLimit" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "scanMode" "ScanMode" NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipeId" TEXT,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "thumbnailUrls" TEXT[],
    "culturalContext" TEXT,
    "funFacts" TEXT[],
    "badgeKeys" TEXT[],

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionSnapshot" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION NOT NULL,
    "sugar" DOUBLE PRECISION NOT NULL,
    "sodium" INTEGER NOT NULL,

    CONSTRAINT "NutritionSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionItem" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "NutritionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientItem" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "item" TEXT NOT NULL,

    CONSTRAINT "IngredientItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instruction" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT,

    CONSTRAINT "Instruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variation" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "add" TEXT,
    "swap" TEXT,

    CONSTRAINT "Variation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyIntakeLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mealType" "MealType" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "DailyIntakeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalAssistantLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonalAssistantLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenAIResponse" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "raw" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenAIResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionSnapshot_recipeId_key" ON "NutritionSnapshot"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyIntakeLog_scanId_key" ON "DailyIntakeLog"("scanId");

-- CreateIndex
CREATE UNIQUE INDEX "OpenAIResponse_scanId_key" ON "OpenAIResponse"("scanId");

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionSnapshot" ADD CONSTRAINT "NutritionSnapshot_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionItem" ADD CONSTRAINT "NutritionItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientItem" ADD CONSTRAINT "IngredientItem_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instruction" ADD CONSTRAINT "Instruction_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variation" ADD CONSTRAINT "Variation_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyIntakeLog" ADD CONSTRAINT "DailyIntakeLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyIntakeLog" ADD CONSTRAINT "DailyIntakeLog_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalAssistantLog" ADD CONSTRAINT "PersonalAssistantLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenAIResponse" ADD CONSTRAINT "OpenAIResponse_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
