const controller = require("../controller/OpenAiController");
const express = require("express");
const router = express.Router();

router.post("/food", controller.promptFoodInformation);

module.exports = router;
