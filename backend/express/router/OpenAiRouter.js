const controller = require("../controller/OpenAiController");
const express = require("express");
const router = express.Router();
const upload = require("../../config/multerConfig");

router.post("/food", controller.promptFoodInformation);
// router.post("/food-vision", upload.single("image"), controller.openaiVision);
// router.post(
//   "/food-vision",
//   upload.single("image"),
//   controller.detectDish,
//   controller.openaiVision
// );

module.exports = router;
