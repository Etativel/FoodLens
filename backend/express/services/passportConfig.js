require("dotenv").config({ path: "../.env" });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const userService = require("./userService");

passport.use(
  "user-local",
  new LocalStrategy(
    {
      usernameField: "credential",
      passwordField: "password",
    },
    async function (credential, password, cb) {
      try {
        const normalizedCredential = credential.toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let user;
        if (emailRegex.test(normalizedCredential)) {
          user = await userService.getUserByEmail(normalizedCredential);
        } else {
          user = await userService.getUserByUsername(normalizedCredential);
        }

        if (!user) {
          if (emailRegex.test(normalizedCredential)) {
            return cb(null, false, { message: "Email not registered." });
          } else {
            return cb(null, false, { message: "Username not registered." });
          }
        }

        if (!user.passwordHash) {
          return cb(null, false, { message: "Incorrect password" });
        }

        const match = await bcrypt.compare(password, user.passwordHash); //Make sure the field match you database (e.g. password stored as passwordHas in the database)
        if (!match) {
          return cb(null, false, { message: "Incorrect password" });
        }

        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

passport.use(
  "admin-local",
  new LocalStrategy(
    {
      usernameField: "credential",
      passwordField: "password",
    },
    async function (credential, password, cb) {
      try {
        const normalizedCredential = credential.toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let user;
        if (emailRegex.test(normalizedCredential)) {
          user = await userService.getUserByEmail(normalizedCredential);
        } else {
          user = await userService.getUserByUsername(normalizedCredential);
        }

        if (!user) {
          if (emailRegex.test(normalizedCredential)) {
            return cb(null, false, { message: "Email not registered." });
          } else {
            return cb(null, false, {
              message: "Username not registered.",
            });
          }
        }
        if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
          return cb(null, false, {
            message:
              "Access Denied: Your account does not have administrative privileges. Please contact support if you believe this is an error.",
          });
        }
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
          return cb(null, false, { message: "Incorrect password" });
        }

        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, cb) => {
      try {
        const user = await userService.getUserById(payload.id);
        return cb(null, user || false);
      } catch (err) {
        return cb(err, false);
      }
    }
  )
);
const allowedDomains = [
  "gmail.com",
  "outlook.com",
  "yahoo.com",
  "protonmail.com",
];

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return cb(null, false, { message: "No email from Google" });

        const domain = email.split("@")[1];
        if (!allowedDomains.includes(domain)) {
          return cb(null, false, { message: "Email domain not allowed" });
        }

        let user = await userService.getUserByGoogleId(profile.id);

        // If user not found by Google ID, check for existing user by email
        if (!user) {
          user = await userService.getUserByEmail(email);
          if (user) {
            // Link Google to existing local account
            await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId: profile.id,
                provider: "google",
              },
            });
          } else {
            // Create new user
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName,
                googleId: profile.id,
                provider: "google",
              },
            });
          }
        }

        return cb(null, user);
      } catch (err) {
        return cb(err, false);
      }
    }
  )
);
