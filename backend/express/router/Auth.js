require("dotenv").config({ path: "../.env" });
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const mailer = require("../utils/mailer");
const userService = require("../services/userService");
const createLimiter = require("../utils/limiter.js");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userCreationLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 10,
});

const resetTokenLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
});

const allowedDomains = [
  "gmail.com",
  "outlook.com",
  "yahoo.com",
  "protonmail.com",
];

function isAllowedDomain(email) {
  if (!email || typeof email !== "string") return false;

  const domain = email.split("@")[1]?.toLowerCase();
  return allowedDomains.includes(domain);
}

// Authentication middleware to verify JWT from httpOnly cookie
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: No token provided",
      token: token,
      user: {
        id: null,
      },
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

router.post("/request-code", userCreationLimiter, async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!isAllowedDomain(email)) {
    return res.status(403).json({ error: "Email domain not allowed" });
  }

  const existingUser = await userService.getUserByEmail(email);

  if (existingUser) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const code = Array.from({ length: 4 }, () =>
    Math.floor(crypto.randomInt(0, 10))
  ).join("");

  console.log(code);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  // delete existing codes for that email
  await prisma.loginCode.deleteMany({
    where: { email: email.toLowerCase() },
  });

  // create new code
  await prisma.loginCode.create({
    data: {
      email: email.toLowerCase(),
      code,
      expiresAt,
    },
  });

  // send code
  await mailer.sendLoginCode(email, code);

  return res.status(200).json({ message: "Code sent" });
});

router.post("/verify-code", userCreationLimiter, async (req, res) => {
  const { email, fullName, password, code } = req.body;

  try {
    const record = await prisma.LoginCode.findUnique({
      where: { email },
    });

    if (
      !record ||
      record.code !== code ||
      new Date() > record.expiresAt.getTime()
    ) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    // Optional: clean up verification record
    await prisma.LoginCode.delete({ where: { email } });

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name: fullName,
        passwordHash: hashedPassword,
        provider: "email",
      },
    });

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error verifying code:", err);
    return res.status(500).json({ error: "Internal server error", err });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("user-local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info && info.message ? info.message : "Bad request",
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        // secure: true,
        // sameSite: "Lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // maxAge: 30000,
      });
      return res.json({ user });
    });
  })(req, res);
});

// Redirect to Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback after Google redirect back
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    //set cookie
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("https://foodlens.up.railway.app/onboarding");
  }
);

router.post("/create-reset-token", resetTokenLimiter, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res
        .status(200)
        .json({ message: "If that email exists, a reset link has been sent." });
    }

    // Remove any existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // compute expiry (1 hour from now)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    // store hashed token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        used: false,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
    console.log(resetLink);
    await mailer.sendPasswordReset(email, resetLink);

    // always respond 200 to prevent email enumeration
    return res
      .status(200)
      .json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.log("Internal server error, ", err);
    return res.status(500).json({ message: "Internal server error, ", err });
  }
});

router.post("/check-reset-token", async (req, res) => {
  const { token } = req.body;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ valid: false, message: "Token is required" });
  }
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  try {
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!record || record.used || record.expiresAt.getTime() < Date.now()) {
      return res
        .status(200)
        .json({ valid: false, message: "Invalid or expired token" });
    }

    return res.status(200).json({ valid: true });
  } catch (err) {
    console.log("internal server error, ", err);
    return res.status(500).json({ message: "Internal server error, ", err });
  }
});

router.patch("/change-user-password", async (req, res) => {
  const { newPassword, token } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  try {
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!record || record.used || record.expiresAt.getTime() < Date.now()) {
      return res
        .status(200)
        .json({ valid: false, message: "Invalid or expired token" });
    }

    await prisma.user.update({
      where: {
        id: record.userId,
      },
      data: {
        passwordHash: hashedPassword,
      },
    });

    await prisma.passwordResetToken.update({
      where: { tokenHash },
      data: {
        used: true,
      },
    });

    return res
      .status(200)
      .json({ message: "Successfully change your password" });
  } catch (err) {
    console.log("Internal server error, ", err);
    return res.status(500).json({ message: "Internal server error, ", err });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
});

router.get("/profile", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = { router, authenticateToken };
