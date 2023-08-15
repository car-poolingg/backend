const express = require("express");
const router = express.Router();
const userAuthentication = require("../../middlewares/user.auth");

const {
    findRide,
    sendRideRequest,
    getRide,
} = require("../../controllers/user.controller/rideController");

router
    .route("/")
    .get(userAuthentication, findRide)
    .post(userAuthentication, sendRideRequest);
router.get("/:id", userAuthentication, getRide);

module.exports = router;
