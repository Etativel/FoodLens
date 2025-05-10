const controller = require("../controller/OpenAiController");
const express = require("express");
const router = express.Router();
const upload = require("../../config/multerConfig");
const authenticateEither = require("../middleware/authEither");

router.post(
  "/food",
  authenticateEither,
  upload.single("image"),
  controller.promptFoodInformation
);

// Add is premium auth
router.post(
  "/food-vision",
  authenticateEither,
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
