const express = require("express");
const router = express.Router();
const userAuthentication = require("../../middlewares/user.auth");

const { fetchNotifications } = require("../../controllers/user.controller/notificationController.js");

router.get("/", userAuthentication, fetchNotifications);

module.exports = router;
