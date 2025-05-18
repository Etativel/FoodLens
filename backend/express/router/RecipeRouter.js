const express = require("express");
const router = express.Router();
const controller = require("../controller/RecipeController");
const authenticateEither = require("../middleware/authEither");
const createLimiter = require("../utils/limiter.js");

const recipeLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

router.get("/", authenticateEither, recipeLimiter, controller.getRecipe);
router.get(
  "/single",
  authenticateEither,
  recipeLimiter,
  controller.getSingleRecipe
);

module.exports = router;
