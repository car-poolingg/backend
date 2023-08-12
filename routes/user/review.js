const express = require("express");
const router = express.Router();
const userAuthentication = require("../../middlewares/user.auth");

const { createReview, getDriverReview } = require("../../controllers/user.controller/reviewController.js");

router.post("/", userAuthentication, createReview);
router.get("/:driverId", userAuthentication, getDriverReview);

module.exports = router;
