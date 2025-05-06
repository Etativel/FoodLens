const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const placeholderUserId = "00000000-0000-0000-0000-000000000000";

(async () => {
  try {
    await prisma.user.upsert({
      where: { id: placeholderUserId },
      create: {
        id: placeholderUserId,
        email: "placeholder@demo.com",
        passwordHash: "not-used",
      },
      update: {}, // Nothing to update
    });
    console.log("Placeholder user created or already exists.");
  } catch (error) {
    console.error("Error creating placeholder user:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
