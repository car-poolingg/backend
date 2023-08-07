const express = require("express");
const router = express.Router();
const userAuthentication = require("../../middlewares/user.auth");

const {
    findRide,
    sendRideRequest,
} = require("../../controllers/user.controller/rideController");

router.route("/").get(userAuthentication, findRide).post(sendRideRequest);

module.exports = router;
