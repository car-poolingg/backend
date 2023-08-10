const express = require("express");
const router = express.Router();
const userAuthentication = require("../../middlewares/user.auth");

const {
    showCurrentUser,
    updateUser,
    AddUserImage,
} = require('../../controllers/user.controller/userController');

router.put("update/:userId", userAuthentication, updateUser );

module.exports = router;
