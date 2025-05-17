const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

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
        scans: {
          include: {
            recipe: {
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
            },
          },
        },
        dailyIntakeLogs: {
          include: {
            scan: {
              include: {
                recipe: {
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
                },
              },
            },
          },
        },
        assistantLogs: true,
      },
    });
    return res.status(200).json({ user });
  } catch (err) {
    console.log("Internal server error", err);
    return res.status(500).json({ message: err });
  }
}

module.exports = {
  createUser,
  getUserForApp,
  userInformationUpdate,
};
