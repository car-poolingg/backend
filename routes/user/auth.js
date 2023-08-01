const express = require("express");
const router = express.Router();

const {
    register,
    login,
    forgotPassword,
    verifyEmail,
    resetPassword,
    google,
    googleCallBack,
    NextFunction,
    logout,
    resendEmailToken,
    verifyPasswordToken,
} = require("../../controllers/user.controller/authController");

router.get("/google", google);
router.get("/google/car-poolingg", googleCallBack, NextFunction);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-email", verifyEmail);
router.post("/resend-email", resendEmailToken);
router.post("/reset-password", resetPassword);
router.post("/password-token", verifyPasswordToken);
router.post("/logout", logout);

module.exports = router;
