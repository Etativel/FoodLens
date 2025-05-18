const controller = require("../controller/OpenAiController");
const express = require("express");
const router = express.Router();
const upload = require("../../config/multerConfig");
const authenticateEither = require("../middleware/authEither");
const createLimiter = require("../utils/limiter.js");

const openaiLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
});

router.post(
  "/food",
  authenticateEither,
  openaiLimiter,
  upload.single("image"),

  controller.promptFoodInformation
);

// Add is premium auth
router.post(
  "/food-vision",
  authenticateEither,
  openaiLimiter,
  upload.single("image"),
  controller.openaiVision
);
// router.post(
//   "/food-vision",
//   upload.single("image"),
//   controller.detectDish,
//   controller.openaiVision
// );

module.exports = router;
