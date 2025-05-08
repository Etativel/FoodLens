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

module.exports = {
  createUser,
};
