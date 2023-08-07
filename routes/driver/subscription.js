const express = require("express");
const router = express.Router();
const driverAuthentication = require("../../middlewares/drive.auth");

const subscribe = require("../../controllers/driver.controller/subscriptionController");

router.post("/", driverAuthentication, subscribe);

module.exports = router;
