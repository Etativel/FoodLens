const express = require("express");
const router = express.Router();
const controller = require("../controller/FoodController");

router.get("/food/:predicted_name", controller.getFoodByPredictedName);

router.patch("/food/:id", controller.updateFood);

router.post("/create", controller.saveFood);

module.exports = router;
