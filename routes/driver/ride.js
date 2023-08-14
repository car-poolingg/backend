const express = require("express");
const router = express.Router();
const driverAuthentication = require("../../middlewares/driver.auth");

const { postRide, updateRideRequest } = require("../../controllers/driver.controller/rideController");

router.route("/").post(driverAuthentication, postRide);
router.patch("/:id", driverAuthentication, updateRideRequest);

module.exports = router;

module.exports = router;
