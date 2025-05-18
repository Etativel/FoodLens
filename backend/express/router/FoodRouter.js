const express = require("express");
const router = express.Router();
const controller = require("../controller/FoodController");
const authenticateEither = require("../middleware/authEither");
const upload = require("../../config/multerConfig");
const createLimiter = require("../utils/limiter.js");

const getFoodLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

router.get("/:foodId", authenticateEither, controller.getFoodById);
router.get("/food/getall", authenticateEither, controller.getAllRecipeName);
router.get(
  "/food/:predicted_name",
  authenticateEither,
  getFoodLimiter,
  controller.getFoodByPredictedName
);

router.get(
  "/recipe",
  authenticateEither,
  getFoodLimiter,
  controller.findRecipe
);

router.patch(
  "/food/:id",
  authenticateEither,
  getFoodLimiter,
  controller.updateFood
);

router.post(
  "/create/scan",
  upload.single("image"),
  authenticateEither,
  getFoodLimiter,
  controller.createScan
);

router.post(
  "/save-log",
  authenticateEither,
  getFoodLimiter,
  controller.saveIntakeLog
);

router.post("/create", authenticateEither, getFoodLimiter, controller.saveFood);

module.exports = router;
