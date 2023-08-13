const express = require("express");
const router = express.Router();
const driverAuthentication = require("../../middlewares/driver.auth");

const { showCurrentDriver, updateDriver, AddDriverDocument } = require("../../controllers/driver.controller/driverController");

router.get("/", driverAuthentication, showCurrentDriver);
router.patch("/update", driverAuthentication, updateDriver);
router.patch("/upload", driverAuthentication, AddDriverDocument);

module.exports = router;
