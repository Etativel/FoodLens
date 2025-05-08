const express = require("express");
const router = express.Router();
const controller = require("../controller/UserController");

router.post("/create", controller.createUser);

module.exports = router;
