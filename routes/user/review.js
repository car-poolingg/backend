const express = require("express");
const router = express.Router();
const userAuthentication = require("../../middlewares/user.auth");

const {
    createReview,
} = require("../../controllers/user.controller/reviewController.js");

router.post("/", userAuthentication, createReview);

module.exports = router;
