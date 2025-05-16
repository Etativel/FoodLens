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
        calorieLimit: true,
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
};
