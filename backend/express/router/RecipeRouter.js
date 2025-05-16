const express = require("express");
const router = express.Router();
const controller = require("../controller/RecipeController");
const authenticateEither = require("../middleware/authEither");

router.get("/", authenticateEither, controller.getRecipe);
router.get("/single", authenticateEither, controller.getSingleRecipe);

module.exports = router;
