const passport = require("passport");
const User = require("../../models/user.model/user");
const customApiError = require("../../errors");
const crypto = require("crypto");
const utils = require("../../utils");

const google = passport.authenticate("google", { scope: ["profile", "email"] });
const googleCallBack = passport.authenticate("google", {
    // successRedirect: "",
    failureRedirect: "",
    successFlash: true,
});
const NextFunction = async (req, res) => {
    res.status(200).json({ msg: "You are logged in" });
};

const register = async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    const isEmail = await User.findOne({ email });
    if (isEmail) {
        throw new customApiError.BadRequestError("Email exists already");
    }

    const number = Math.floor(Math.random() * 90000) + 10000;
    const verificationToken = number.toString();
    const tokenExpirationDate = new Date(Date.now() + 5 * 60 * 1000);
    console.log(verificationToken);
    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        verificationToken: utils.createHash(verificationToken),
        tokenExpirationDate,
    });
    //send email verification to user
    const origin = "http://localhost:8080/api/v1/auth";
    await utils.sendVerificationEmail({
        name: user.firstName,
        email: user.email,
        verificationToken: user.verificationToken,
        origin,
    });
    res.status(201).json({
        msg: "Success, Please check your email to verify your account.",
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new customApiError.BadRequestError(
            "Please enter your email and password"
        );
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new customApiError.UnAuthenticatedError("Invalid Email");
    }
    const isPassword = await user.ComparePassword(password);
    if (!isPassword) {
        throw new customApiError.UnAuthenticatedError("Incorrect Password");
    }
    //check whether user is verified
    if (!user.isVerified) {
        throw new customApiError.UnAuthenticatedError(
            "Check your email to verify your account"
        );
    }
    const tokenUser = utils.createTokenUser(user);
    const token = utils.createJWT(tokenUser);

    res.status(200).json({ user: tokenUser, token });
    return;
};

const verifyEmail = async (req, res) => {
    const { email, token } = req.query;
    const user = await User.findOne({ email });
    if (!user) {
        throw new customApiError.UnAuthenticatedError("Invalid email");
    }
    if (token !== user.verificationToken) {
        throw new customApiError.UnAuthenticatedError("Invalid token");
    }
    user.isVerified.email = true;
    user.verified = new Date(Date.now());
    user.verificationToken = "";
    await user.save();

    res.status(200).json({
        msg: "Your email has been verified",
    });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new customApiError.BadRequestError(
            "Please provide your account's email address"
        );
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new customApiError.NotFoundError("User does not exist");
    }
    const origin = "http://localhost:8080/api/v1/auth";
    const passwordToken = crypto.randomBytes(40).toString("hex");
    let fiveMinutes = 1000 * 60 * 5;
    const passwordTokenExpirationDate = new Date(Date.now() + fiveMinutes);
    await utils.sendResetPasswordEmail({
        name: user.firstName,
        email: user.email,
        passwordToken,
        origin,
    });

    user.passwordToken = utils.createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();

    res.status(200).json({ msg: "Please check your email to reset password" });
};

const resetPassword = async (req, res) => {
    const { email, token } = req.query;
    const { password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new customApiError.NotFoundError("User does not exist");
    }
    if (!password) {
        throw new customApiError.BadRequestError(
            "Please enter your new password"
        );
    }
    let currentDay = new Date(Date.now());
    if (
        user.passwordToken === utils.createHash(token) &&
        user.passwordTokenExpirationDate > currentDay
    ) {
        user.password = password;
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;
        await user.save();
    } else {
        throw new customApiError.BadRequestError("Invalid Token");
    }
    res.status(200).json({
        msg: "Password reset is successful",
    });
};

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
