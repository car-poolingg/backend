const express = require("express");
const router = express.Router();
const driverAuthentication = require("../../middlewares/driver.auth");

const { fetchNotifications } = require("../../controllers/user.controller/notificationController.js");

router.get("/", driverAuthentication, fetchNotifications);

module.exports = router;
