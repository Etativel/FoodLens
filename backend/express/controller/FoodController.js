const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

// POST
// async function saveFood(req, res) {
//   const { recipe } = req.body;

//   // validate required fields
//   const requiredFields = [
//     "name",
//     "predicted_name",
//     "summary",
//     "nutritionSnapshot",
//     "nutritionItems",
//     "ingredients",
//     "instructions",
//     "variations",
//   ];

//   const missingFields = requiredFields.filter((field) => !recipe[field]);

//   if (missingFields.length > 0) {
//     return res.status(400).json({
//       message: "Missing required fields",
//       missingFields,
//     });
//   }

//   try {
//     // check if recipe with predicted_name already exists to avoid duplication
//     const existingRecipe = await prisma.recipe.findUnique({
//       where: { predicted_name: recipe.predicted_name },
//     });

//     if (existingRecipe) {
//       return res.status(409).json({
//         message: "Recipe with this predicted_name already exists",
//         recipeId: existingRecipe.id,
//       });
//     }

//     // create recipe with all related data
//     const newFood = await prisma.recipe.create({
//       data: {
//         name: recipe.name,
//         predicted_name: recipe.predicted_name,
//         summary: recipe.summary,
//         thumbnailUrls: recipe.thumbnailUrls || [],
//         culturalContext: recipe.culturalContext || null,
//         funFacts: recipe.funFacts || [],
//         tips: recipe.tips,
//         badgeKeys: recipe.badgeKeys || [],

//         // create nutrition snapshot
//         nutritionSnapshot: {
//           create: {
//             calories: recipe.nutritionSnapshot.calories,
//             protein: recipe.nutritionSnapshot.protein,
//             fat: recipe.nutritionSnapshot.fat,
//             carbs: recipe.nutritionSnapshot.carbs,
//             fiber: recipe.nutritionSnapshot.fiber,
//             sugar: recipe.nutritionSnapshot.sugar,
//             sodium: recipe.nutritionSnapshot.sodium,
//           },
//         },

//         // create nutrition items
//         nutritionItems: {
//           create: recipe.nutritionItems.map((item) => ({
//             name: item.name,
//             value: item.value,
//             unit: item.unit,
//           })),
//         },

//         // create ingredient groups and their items
//         ingredients: {
//           create: recipe.ingredients.map((ing) => ({
//             groupName: ing.group,
//             items: {
//               create: ing.items.map((text) => ({
//                 item: text,
//               })),
//             },
//           })),
//         },

//         // create instructions
//         instructions: {
//           create: recipe.instructions.map((instruction) => ({
//             stepNumber: instruction.step,
//             description: instruction.description,
//             duration: instruction.duration || null,
//           })),
//         },

//         // create variations
//         variations: {
//           create: recipe.variations.map((variation) => ({
//             name: variation.name,
//             add: variation.add || null,
//             swap: variation.swap || null,
//           })),
//         },
//       },
//       // include related data in response
//       include: {
//         nutritionSnapshot: true,
//         nutritionItems: true,
//         ingredients: {
//           include: {
//             items: true,
//           },
//         },
//         instructions: true,
//         variations: true,
//       },
//     });

//     return res.status(201).json({
//       message: "Recipe created successfully",
//       recipe: newFood,
//     });
//   } catch (error) {
//     console.error("Error creating recipe:", error);

//     // unique constraint violations
//     if (error.code === "P2002") {
//       return res.status(409).json({
//         message: "A recipe with this information already exists",
//         field: error.meta?.target?.[0] || "unknown field",
//       });
//     }

//     return res.status(500).json({
//       message: "Failed to create recipe",
//       error:
//         process.env.NODE_ENV === "production"
//           ? "Internal server error"
//           : error.message,
//     });
//   }
// }

// POST  /food-api/create
// async function saveFood(req, res) {
//   const { recipe, imageUrl, scanMode } = req.body;
//   // const userId = req.user.id;
//   const placeholderUserId = "00000000-0000-0000-0000-000000000000";
//   const requiredFields = [
//     "name",
//     "predicted_name",
//     "summary",
//     "nutritionSnapshot",
//     "nutritionItems",
//     "ingredients",
//     "instructions",
//     "variations",
//   ];

//   const missingFields = requiredFields.filter((f) => !recipe[f]);
//   if (missingFields.length > 0) {
//     return res
//       .status(400)
//       .json({ message: "Missing required fields", missingFields });
//   }

//   try {
//     const existingRecipe = await prisma.recipe.findUnique({
//       where: { predicted_name: recipe.predicted_name },
//       select: { id: true },
//     });

//     const upserted = await prisma.recipe.upsert({
//       where: { predicted_name: recipe.predicted_name },
//       create: {
//         name: recipe.name,
//         predicted_name: recipe.predicted_name,
//         summary: recipe.summary,
//         thumbnailUrls: recipe.thumbnailUrls || [],
//         culturalContext: recipe.culturalContext || null,
//         funFacts: recipe.funFacts || [],
//         tips: recipe.tips,
//         badgeKeys: recipe.badgeKeys || [],
//         nutritionSnapshot: {
//           create: { ...recipe.nutritionSnapshot },
//         },
//         nutritionItems: {
//           create: recipe.nutritionItems.map((i) => ({
//             name: i.name,
//             value: i.value,
//             unit: i.unit,
//           })),
//         },
//         ingredients: {
//           create: recipe.ingredients.flatMap((grp) =>
//             grp.items.map((item) => ({
//               groupName: grp.group,
//               items: { create: { item } },
//             }))
//           ),
//         },
//         instructions: {
//           create: recipe.instructions.map((ins) => ({
//             stepNumber: ins.step,
//             description: ins.description,
//             duration: ins.duration || null,
//           })),
//         },
//         variations: {
//           create: recipe.variations.map((v) => ({
//             name: v.name,
//             add: v.add || null,
//             swap: v.swap || null,
//           })),
//         },
//       },
//       update: {
//         name: recipe.name,
//         summary: recipe.summary,
//         thumbnailUrls: recipe.thumbnailUrls || [],
//         culturalContext: recipe.culturalContext || null,
//         funFacts: recipe.funFacts || [],
//         tips: recipe.tips,
//         badgeKeys: recipe.badgeKeys || [],
//         nutritionSnapshot: {
//           upsert: {
//             create: { ...recipe.nutritionSnapshot },
//             update: { ...recipe.nutritionSnapshot },
//           },
//         },
//         nutritionItems: {
//           deleteMany: {},
//           create: recipe.nutritionItems.map((i) => ({
//             name: i.name,
//             value: i.value,
//             unit: i.unit,
//           })),
//         },
//         ingredients: {
//           deleteMany: {},
//           create: recipe.ingredients.flatMap((grp) =>
//             grp.items.map((item) => ({
//               groupName: grp.group,
//               items: { create: { item } },
//             }))
//           ),
//         },
//         instructions: {
//           deleteMany: {},
//           create: recipe.instructions.map((ins) => ({
//             stepNumber: ins.step,
//             description: ins.description,
//             duration: ins.duration || null,
//           })),
//         },
//         variations: {
//           deleteMany: {},
//           create: recipe.variations.map((v) => ({
//             name: v.name,
//             add: v.add || null,
//             swap: v.swap || null,
//           })),
//         },
//       },
//       select: { id: true },
//     });

//     await prisma.scan.create({
//       data: {
//         userId: placeholderUserId,
//         imageUrl,
//         scanMode,
//         recipeId: upserted.id,
//       },
//     });

//     const full = await prisma.recipe.findUnique({
//       where: { id: upserted.id },
//       include: {
//         nutritionSnapshot: true,
//         nutritionItems: true,
//         ingredients: { include: { items: true } },
//         instructions: true,
//         variations: true,
//         scans: true,
//       },
//     });

//     res.status(existingRecipe ? 200 : 201).json({
//       message: existingRecipe ? "Recipe updated" : "Recipe created",
//       recipe: full,
//     });
//   } catch (error) {
//     console.error("Error saving recipe + scan:", error);
//     if (error.code === "P2002") {
//       return res.status(409).json({
//         message: "Duplicate predicted_name",
//         field: error.meta?.target,
//       });
//     }
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// }

async function saveFood(req, res) {
  const { recipe, imageUrl, scanMode } = req.body;
  // const userId = req.user.id;
  const placeholderUserId = "00000000-0000-0000-0000-000000000000";
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

    await prisma.scan.create({
      data: {
        userId: placeholderUserId,
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

module.exports = {
  saveFood,
  getFoodByPredictedName,
  updateFood,
  getAllRecipeName,
};
