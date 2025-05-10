const express = require("express");
const router = express.Router();
const controller = require("../controller/FoodController");
const authenticateEither = require("../middleware/authEither");
const upload = require("../../config/multerConfig");

router.get("/food/getall", controller.getAllRecipeName);
router.get(
  "/food/:predicted_name",
  authenticateEither,
  controller.getFoodByPredictedName
);

router.patch("/food/:id", authenticateEither, controller.updateFood);

router.post(
  "/create/scan",
  upload.single("image"),
  authenticateEither,
  controller.createScan
);
router.post("/create", authenticateEither, controller.saveFood);

module.exports = router;
