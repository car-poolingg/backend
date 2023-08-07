const express = require("express");
const router = express.Router();
const userAuthentication = require("../../middlewares/user.auth");

const subscribe = require("../../controllers/user.controller/subscriptionController");

router.post("/", subscribe);

module.exports = router;
