const express = require("express");
const router = express.Router();
const controller = require("../controller/UserController");
const authenticateEither = require("../middleware/authEither");
const createLimiter = require("../utils/limiter.js");

const createUserLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
});

router.post("/create", createUserLimiter, controller.createUser);

router.post("/getProfile", authenticateEither, controller.getUserForApp);

router.patch(
  "/update-user",
  authenticateEither,
  controller.userInformationUpdate
);

module.exports = router;
