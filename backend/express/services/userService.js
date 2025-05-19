const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getUserByUsername(username) {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
}

async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function getUserById(userId) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}

async function getUserByGoogleId(googleId) {
  return prisma.user.findUnique({ where: { googleId } });
}

module.exports = {
  getUserByUsername,
  getUserById,
  getUserByEmail,
  getUserByGoogleId,
};
