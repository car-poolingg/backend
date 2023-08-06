const express = require("express");
const router = express.Router();

const {
    register,
    login,
    forgotPassword,
    verifyPhone,
    resetPassword,
    logout,
    resendPhoneToken,
    verifyPasswordToken,
} = require("../../controllers/driver.controller/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-phone", verifyPhone);
router.post("/resend-token", resendPhoneToken);
router.post("/reset-password", resetPassword);
router.post("/password-token", verifyPasswordToken);
router.post("/logout", logout);

module.exports = router;
