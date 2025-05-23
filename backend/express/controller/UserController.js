const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

// Utility
const normalize = (name) => {
  const lower = name.toLowerCase();
  if (lower === "carbohydrates") return "carbs";
  return lower;
};

// POST
async function createUser(req, res) {
  const { userData } = req.body;
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  try {
    await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash: hashedPassword,
        name: userData.fullName,
      },
    });
    return res.status(200).json({ message: "User created" });
  } catch (err) {
    console.log("Internal server error", err);
    return res.status(500).json({ message: err });
  }
}

async function reduceCredit(req, res) {
  const { userId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const response = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        scanCreditsRemaining: user.scanCreditsRemaining - 1,
      },
    });
    return res.status(200).json({ response });
  } catch (err) {
    console.log("Internal server error, ", err);
    return res.status(500).json({ message: "Internal server error, ", err });
  }
}

// PATCH
async function userInformationUpdate(req, res) {
  const { value, userId, fieldName } = req.body;
  const allowedFields = [
    "weightGoal",
    "height",
    "weight",
    "calorieLimit",
    "sodiumLimit",
    "proteinLimit",
    "fatLimit",
    "carbohydrateLimit",
    "fiberLimit",
    "sugarLimit",
  ];
  if (!allowedFields.includes(fieldName)) {
    return res.status(400).json({ message: "Invalid field name" });
  }
  try {
    const updated = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        [fieldName]: value,
      },
    });
    return res.status(200).json({ message: "Updated successfully", updated });
  } catch (err) {
    console.log("Internal server error, ", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// GET

// Get user information for the front end app, make sure not to include sensitive information
async function getUserForApp(req, res) {
  const { userId } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        isPremium: true,
        scanCreditsRemaining: true,
        weightGoal: true,
        weight: true,
        height: true,
        calorieLimit: true,
        sodiumLimit: true,
        proteinLimit: true,
        fatLimit: true,
        carbohydrateLimit: true,
        fiberLimit: true,
        sugarLimit: true,
        createdAt: true,
        // scans: {
        //   include: {
        //     recipe: {
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
        //         scans: true,
        //       },
        //     },
        //   },
        // },
        // dailyIntakeLogs: {
        //   include: {
        //     scan: {
        //       include: {
        //         recipe: {
        //           include: {
        //             nutritionSnapshot: true,
        //             nutritionItems: true,
        //             ingredients: {
        //               include: {
        //                 items: true,
        //               },
        //             },
        //             instructions: true,
        //             variations: true,
        //             scans: true,
        //           },
        //         },
        //       },
        //     },
        //   },
        // },
        assistantLogs: true,
      },
    });
    return res.status(200).json({ user });
  } catch (err) {
    console.log("Internal server error", err);
    return res.status(500).json({ message: err });
  }
}

async function getTodaySummary(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing required field: userId" });
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const dailyIntakeLogs = await prisma.dailyIntakeLog.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        date: "asc",
      },
      include: {
        scan: {
          include: {
            recipe: {
              include: {
                nutritionSnapshot: true,
                nutritionItems: true,
                ingredients: true,
                instructions: true,
                variations: true,
              },
            },
          },
        },
      },
    });
    if (!dailyIntakeLogs || dailyIntakeLogs.length === 0) {
      return res.status(200).json({ totals: {}, recipeObject: [] });
    }

    let totals = {};
    dailyIntakeLogs.map((intake) => {
      intake.scan.recipe.nutritionItems.forEach(({ name, value, unit }) => {
        const key = normalize(name);
        if (totals[key]) {
          totals[key].current += value;
        } else {
          totals[key] = { current: value, unit };
        }
      });
    });
    const recipeObject = dailyIntakeLogs.map((intake) => {
      return { ...intake.scan.recipe, imageUrl: intake.scan.imageUrl };
    });
    return res.status(200).json({ totals, recipeObject });
  } catch (err) {
    console.log("internal server error, ", err);
    return res.status(500).json({ message: "Internal server error, ", err });
  }
}

async function getAllDailySummaries(req, res) {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "Missing required field: userId" });
  }

  try {
    // Fetch all logs for this user
    const logs = await prisma.dailyIntakeLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: {
        scan: {
          include: {
            recipe: {
              include: {
                nutritionSnapshot: true,
                nutritionItems: true,
                ingredients: true,
                instructions: true,
                variations: true,
              },
            },
          },
        },
      },
    });

    if (!logs.length) {
      return res.status(200).json([]);
    }
    console.log(logs);
    // Group by YYYY-MM-DD
    const byDate = {};
    logs.forEach((intake) => {
      const isoDate = intake.date.toISOString().split("T")[0];
      if (!byDate[isoDate]) {
        byDate[isoDate] = { totals: {}, recipes: [] };
      }

      // Accumulate nutrition using your normalize()
      intake.scan.recipe.nutritionItems.forEach(({ name, value, unit }) => {
        const key = normalize(name);
        if (byDate[isoDate].totals[key]) {
          byDate[isoDate].totals[key].current += value;
        } else {
          byDate[isoDate].totals[key] = { current: value, unit };
        }
      });

      // Collect recipe info
      byDate[isoDate].recipes.push({
        imageUrl: intake.scan.imageUrl,
        ...intake.scan.recipe,
      });
    });

    // Format as array
    const result = Object.entries(byDate).map(
      ([date, { totals, recipes }]) => ({ date, totals, recipes })
    );

    return res.status(200).json(result);
  } catch (err) {
    console.error("Internal server error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
}

async function getAllScanHistory(req, res) {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "Missing required field: userId" });
  }

  try {
    const scans = await prisma.scan.findMany({
      where: {
        userId,
      },
      orderBy: {
        scannedAt: "desc",
      },
      include: {
        recipe: {
          include: {
            nutritionSnapshot: true,
            nutritionItems: true,
            ingredients: true,
            instructions: true,
            variations: true,
          },
        },
        intakeLog: true,
        openAIResp: true,
      },
    });
    return res.status(200).json({ scans });
  } catch (err) {
    console.error("Internal server error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
}

module.exports = {
  getAllScanHistory,
  createUser,
  getUserForApp,
  userInformationUpdate,
  reduceCredit,
  getTodaySummary,
  getAllDailySummaries,
  getAllScanHistory,
};
