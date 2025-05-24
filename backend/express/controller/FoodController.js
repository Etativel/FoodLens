const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../config/cloudinaryConfig");
// GET

async function getFoodByPredictedName(req, res) {
  const { predicted_name } = req.params;
  try {
    const data = await prisma.recipe.findUnique({
      where: {
        predicted_name,
      },
      include: {
        nutritionSnapshot: true,
        nutritionItems: true,
        ingredients: {
          include: {
            items: true,
          },
        },
        instructions: true,
        variations: true,
        scans: true,
      },
    });

    if (!data) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    const ingredients = data.ingredients.map((group) => ({
      group: group.groupName,
      items: group.items.map((i) => i.item),
    }));

    return res.status(200).json({
      data: {
        ...data,
        ingredients,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}

async function getAllRecipeName(req, res) {
  try {
    const food = await prisma.recipe.findMany({
      // select: {
      //   name: true,
      //   predicted_name: true,
      // },
      include: {
        scans: true,
        nutritionSnapshot: true,
        nutritionItems: true,
        ingredients: true,
        instructions: true,
        variations: true,
      },
    });
    return res.status(200).json({ food });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}

async function getFoodById(req, res) {
  const { foodId } = req.params;

  try {
    const data = await prisma.recipe.findUnique({
      where: {
        id: foodId,
      },
      include: {
        nutritionSnapshot: true,
        nutritionItems: true,
        ingredients: {
          include: {
            items: true,
          },
        },
        instructions: true,
        variations: true,
        scans: true,
      },
    });

    if (!data) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    const ingredients = data.ingredients.map((group) => ({
      group: group.groupName,
      items: group.items.map((i) => i.item),
    }));

    return res.status(200).json({
      data: {
        ...data,
        ingredients,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}

// POST
async function saveFood(req, res) {
  const { recipe, imageUrl, scanMode } = req.body;
  const userId = req.user.id;

  const requiredFields = [
    "name",
    "predicted_name",
    "summary",
    "nutritionSnapshot",
    "nutritionItems",
    "ingredients",
    "instructions",
    "variations",
  ];

  const missingFields = requiredFields.filter((f) => !recipe[f]);
  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ message: "Missing required fields", missingFields });
  }

  try {
    const existingRecipe = await prisma.recipe.findUnique({
      where: { predicted_name: recipe.predicted_name },
      select: { id: true },
    });

    if (existingRecipe) {
      await prisma.$transaction([
        prisma.ingredientItem.deleteMany({
          where: {
            ingredientGroup: {
              recipeId: existingRecipe.id,
            },
          },
        }),
        prisma.ingredient.deleteMany({
          where: { recipeId: existingRecipe.id },
        }),
        prisma.nutritionItem.deleteMany({
          where: { recipeId: existingRecipe.id },
        }),
        prisma.instruction.deleteMany({
          where: { recipeId: existingRecipe.id },
        }),
        prisma.variation.deleteMany({
          where: { recipeId: existingRecipe.id },
        }),
      ]);
    }

    const upserted = await prisma.recipe.upsert({
      where: { predicted_name: recipe.predicted_name },
      create: {
        name: recipe.name,
        predicted_name: recipe.predicted_name,
        summary: recipe.summary,
        thumbnailUrls: recipe.thumbnailUrls || [],
        culturalContext: recipe.culturalContext || null,
        funFacts: recipe.funFacts || [],
        tips: recipe.tips,
        badgeKeys: recipe.badgeKeys || [],
        nutritionSnapshot: {
          create: { ...recipe.nutritionSnapshot },
        },
        nutritionItems: {
          create: recipe.nutritionItems.map((i) => ({
            name: i.name,
            value: i.value,
            unit: i.unit,
          })),
        },
        ingredients: {
          create: recipe.ingredients.map((grp) => ({
            groupName: grp.group,
            items: {
              create: grp.items.map((item) => ({ item })),
            },
          })),
        },
        instructions: {
          create: recipe.instructions.map((ins) => ({
            stepNumber: ins.step,
            description: ins.description,
            duration: ins.duration || null,
          })),
        },
        variations: {
          create: recipe.variations.map((v) => ({
            name: v.name,
            add: v.add || null,
            swap: v.swap || null,
          })),
        },
      },
      update: {
        name: recipe.name,
        summary: recipe.summary,
        thumbnailUrls: recipe.thumbnailUrls || [],
        culturalContext: recipe.culturalContext || null,
        funFacts: recipe.funFacts || [],
        tips: recipe.tips,
        badgeKeys: recipe.badgeKeys || [],
        nutritionSnapshot: {
          upsert: {
            create: { ...recipe.nutritionSnapshot },
            update: { ...recipe.nutritionSnapshot },
          },
        },

        nutritionItems: {
          create: recipe.nutritionItems.map((i) => ({
            name: i.name,
            value: i.value,
            unit: i.unit,
          })),
        },
        ingredients: {
          create: recipe.ingredients.map((grp) => ({
            groupName: grp.group,
            items: {
              create: grp.items.map((item) => ({ item })),
            },
          })),
        },
        instructions: {
          create: recipe.instructions.map((ins) => ({
            stepNumber: ins.step,
            description: ins.description,
            duration: ins.duration || null,
          })),
        },
        variations: {
          create: recipe.variations.map((v) => ({
            name: v.name,
            add: v.add || null,
            swap: v.swap || null,
          })),
        },
      },
      select: { id: true },
    });

    const createdScan = await prisma.scan.create({
      data: {
        userId: userId,
        imageUrl,
        scanMode,
        recipeId: upserted.id,
      },
    });

    const full = await prisma.recipe.findUnique({
      where: { id: upserted.id },
      include: {
        nutritionSnapshot: true,
        nutritionItems: true,
        ingredients: { include: { items: true } },
        instructions: true,
        variations: true,
        scans: true,
      },
    });

    res.status(existingRecipe ? 200 : 201).json({
      message: existingRecipe ? "Recipe updated" : "Recipe created",
      recipe: full,
      scan: createdScan,
    });
  } catch (error) {
    console.error("Error saving recipe + scan:", error);
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Duplicate predicted_name",
        field: error.meta?.target,
      });
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function createScan(req, res) {
  const { userId, scanMode, recipeId } = req.body;

  const imageUrl = req.file.path;

  try {
    const data = await prisma.scan.create({
      data: {
        userId,
        imageUrl,
        scanMode,
        recipeId,
      },
    });
    return res.status(200).json({ message: "Food scan saved", scan: data });
  } catch (err) {
    console.log("Internal server error, ", err);
    return res.status(500).json({ message: "Failed to create new food scan" });
  }
}

async function saveIntakeLog(req, res) {
  const { userId, scanId, notes } = req.body;
  try {
    const data = await prisma.dailyIntakeLog.create({
      data: {
        userId,
        scanId,
        notes,
      },
    });
    return res.status(200).json({ data });
  } catch (err) {
    console.log("Internal server error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// PATCH
async function updateFood(req, res) {
  const { id } = req.params;
  const { data } = req.body; // expects { data: { field } }

  const allowed = new Set([
    "name",
    "predicted_name",
    "summary",
    "thumbnailUrls",
    "culturalContext",
    "funFacts",
    "badgeKeys",
  ]);

  const toUpdate = {};
  if (data && typeof data === "object") {
    Object.keys(data).forEach((key) => {
      if (allowed.has(key)) {
        toUpdate[key] = data[key];
      }
    });
  }

  if (Object.keys(toUpdate).length === 0) {
    return res
      .status(400)
      .json({ message: "No valid fields provided to update" });
  }

  try {
    const updated = await prisma.recipe.update({
      where: { id },
      data: toUpdate,
    });
    return res.json(updated);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Recipe not found" });
    }
    console.error("Failed to update recipe:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function findRecipe(req, res) {
  const { name } = req.query;

  try {
    const recipe = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
    );

    return res.status(200).json({ recipe });
  } catch (err) {
    console.log("Internal server error, ", err);
    return res.status(500).json({ message: err });
  }
}

// DELETE
async function deleteScanData(req, res) {
  const { scanId } = req.params;
  const { imageUrl } = req.body;
  try {
    const parts = imageUrl.split("/");
    const versionIndex = parts.findIndex((p) => p.startsWith("v"));
    const publicId = parts
      .slice(versionIndex + 1)
      .join("/")
      .replace(/\.[^/.]+$/, "");

    await cloudinary.uploader.destroy(publicId);

    await prisma.scan.delete({
      where: {
        id: scanId,
      },
    });
    return res.status(200).json({ message: "Success" });
  } catch (err) {
    console.log("Internal server error, ", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
}

module.exports = {
  saveFood,
  getFoodByPredictedName,
  updateFood,
  getAllRecipeName,
  createScan,
  findRecipe,
  getFoodById,
  saveIntakeLog,
  deleteScanData,
};
