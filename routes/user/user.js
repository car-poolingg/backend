const express = require("express");
const router = express.Router();
const userAuthentication = require("../../middlewares/user.auth");

const { showCurrentUser, updateUser, AddUserImage } = require("../../controllers/user.controller/userController");

router.get("/", userAuthentication, showCurrentUser);
router.patch("/update", userAuthentication, updateUser);
router.patch("/upload", userAuthentication, AddUserImage);

module.exports = router;
