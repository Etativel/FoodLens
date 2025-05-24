const express = require("express");
const router = express.Router();
const controller = require("../controller/UserController");
const authenticateEither = require("../middleware/authEither");
const createLimiter = require("../utils/limiter.js");

const createUserLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
});

router.post("/home", authenticateEither, controller.getTodaySummary);
router.post("/calories", authenticateEither, controller.getAllDailySummaries);

router.post("/scan-history", authenticateEither, controller.getAllScanHistory);

router.post("/create", createUserLimiter, controller.createUser);

router.post("/getProfile", authenticateEither, controller.getUserForApp);

router.post("/reduceCredit", authenticateEither, controller.reduceCredit);

router.patch(
  "/update-user",
  authenticateEither,
  controller.userInformationUpdate
);

module.exports = router;
