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
    await utils.sendVerificationEmail({
        name: user.firstName,
        email: user.email,
        verificationToken,
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
    const { email, token } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new customApiError.UnAuthenticatedError("Invalid email");

    if (utils.createHash(token) !== user.verificationToken) {
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

    const number = Math.floor(Math.random() * 90000) + 10000;
    const passwordToken = number.toString();
    let fiveMinutes = 1000 * 60 * 5;
    const passwordTokenExpirationDate = new Date(Date.now() + fiveMinutes);
    console.log(passwordToken);
    await utils.sendResetPasswordEmail({
        name: user.firstName,
        email: user.email,
        passwordToken,
    });

    user.passwordToken = utils.createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();

    res.status(200).json({ msg: "Please check your email to reset password" });
};

const resetPassword = async (req, res) => {
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

    user.password = password;
    user.passwordToken = null;
    user.passwordTokenExpirationDate = null;
    await user.save();

    res.status(200).json({
        msg: "Password reset is successful",
    });
};

const resendToken = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const number = Math.floor(Math.random() * 90000) + 10000;
    const verificationToken = number.toString();
    const tokenExpirationDate = new Date(Date.now() + 5 * 60 * 1000);
    console.log(verificationToken);

    await utils.sendVerificationEmail({
        name: user.firstName,
        email: user.email,
        verificationToken,
    });
    user.verificationToken = utils.createHash(verificationToken);
    user.tokenExpirationDate = tokenExpirationDate;
    await user.save();
    res.status(200).json({ msg: "Code successfully sent again." });
};

const verifyEmailToken = async (req, res) => {
    const { token, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new customApiError.UnAuthenticatedError("Invalid email");

    let currentDay = new Date(Date.now());
    if (
        user.verificationToken === utils.createHash(token) &&
        user.tokenExpirationDate > currentDay
    ) {
        user.isVerified = true;
        user.verified = new Date(Date.now());
        user.verificationToken = "";
        user.tokenExpirationDate = null;
        await user.save();
        res.status(200).json({ msg: "Code successfully verified." });
    } else {
        throw new CustomError.UnAuthenticatedError("Invalid token");
    }
};

const verifyPasswordToken = async (req, res) => {
    const { token, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new customApiError.UnAuthenticatedError("Invalid email");

    let currentDay = new Date(Date.now());
    if (
        user.passwordToken === utils.createHash(token) &&
        user.passwordTokenExpirationDate > currentDay
    ) {
        user.isVerified = true;
        user.verified = new Date(Date.now());
        user.passwordToken = "";
        user.passwordTokenExpirationDate = null;
        await user.save();
        res.status(200).json({ msg: "Code successfully verified." });
    } else {
        throw new CustomError.UnAuthenticatedError("Invalid token");
    }
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
    resendToken,
    verifyEmailToken,
    verifyPasswordToken,
};
