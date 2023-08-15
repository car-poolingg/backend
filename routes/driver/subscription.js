const express = require("express");
const router = express.Router();
const driverAuthentication = require("../../middlewares/driver.auth");

const subscribe = require("../../controllers/driver.controller/subscriptionController");

router.post("/", driverAuthentication, subscribe);

module.exports = router;
