const passport = require("passport");
const User = require("../../models/user.model/user");
const customApiError = require("../../errors");

const google = passport.authenticate("google", { scope: ["profile", "email"] });

const googleCallBack = passport.authenticate("google", {
    // successRedirect: "",
    failureRedirect: "",
    successFlash: true,
});

const NextFunction = async (req, res) => {
    res.status(200).json({ msg: "You are logged in" });
};

const register = async (req, res) => {};
const login = async (req, res) => {};
const forgotPassword = async (req, res) => {};
const verifyEmail = async (req, res) => {};
const resetPassword = async (req, res) => {};

const logout = async (req, res) => {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
                throw new customApiError.BadRequestError(
                    "Something went wrong!"
                );
            }
        });
        req.session.destroy((err) => {
            if (err) {
                throw new customApiError.BadRequestError(
                    "Something went wrong!"
                );
            }
        });
    }
    res.status(200).json({ msg: "You are logged out." });
};

module.exports = {
    google,
    googleCallBack,
    NextFunction,
    register,
    login,
    forgotPassword,
    verifyEmail,
    resetPassword,
    logout,
};
