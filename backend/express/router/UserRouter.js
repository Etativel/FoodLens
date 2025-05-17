const express = require("express");
const router = express.Router();
const controller = require("../controller/UserController");
const authenticateEither = require("../middleware/authEither");
router.post("/create", controller.createUser);

router.post("/getProfile", authenticateEither, controller.getUserForApp);

router.patch(
  "/update-user",
  authenticateEither,
  controller.userInformationUpdate
);

module.exports = router;
