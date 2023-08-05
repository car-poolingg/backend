const express = require("express");
const router = express.Router();
const driverAuthentication = require("../../middlewares/driver.auth");

const {
    postRide,
    updateRideRequest,
} = require("../../controllers/driver.controller/rideController");

router.post("/", driverAuthentication, postRide);

module.exports = router;
