const Driver = require("../../models/driver.model/driver");
const customApiError = require("../../errors");
const crypto = require("crypto");
const utils = require("../../utils");

const register = async (req, res) => {
    const { city, email, phone, password } = req.body;

    const isPhone = await Driver.findOne({ phone });
    if (isPhone) {
        throw new customApiError.BadRequestError("Phone number exists already");
    }

    const number = Math.floor(Math.random() * 9000) + 1000;
    const verificationToken = number.toString();
    const tokenExpirationDate = new Date(Date.now() + 5 * 60 * 1000);

    const driver = await Driver.create({
        email,
        phone,
        password,
        city,
        verificationToken: utils.createHash(verificationToken),
        tokenExpirationDate,
    });

    await utils.sendSmsOTP({
        code: verificationToken,
        phone: driver.phone,
    });
    res.status(201).json({
        msg: "Success, Please check your phone messages for the 4-digit token.",
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new customApiError.BadRequestError(
            "Please enter your email and password"
        );
    }
    const driver = await Driver.findOne({ phone });
    if (!driver) {
        throw new customApiError.UnAuthenticatedError("Invalid phone number");
    }
    const isPassword = await driver.ComparePassword(password);
    if (!isPassword) {
        throw new customApiError.UnAuthenticatedError("Incorrect Password");
    }

    if (!driver.isVerified.phone) {
        throw new customApiError.UnAuthenticatedError(
            "Your phone number hasn't been verified yet!"
        );
    }
    const tokenDriver = utils.createTokenUser(driver);
    const token = utils.createJWT(tokenDriver);

    res.status(200).json({ driver: tokenDriver, token });
    return;
};

const verifyPhone = async (req, res) => {
    const { phone, token } = req.body;
    const driver = await Driver.findOne({ phone });
    if (!driver) throw new customApiError.UnAuthenticatedError("Invalid phone");

    let currentDay = new Date(Date.now());

    if (
        driver.verificationToken === utils.createHash(token) &&
        driver.tokenExpirationDate > currentDay
    ) {
        driver.isVerified.phone = true;
        driver.verified = new Date(Date.now());
        driver.verificationToken = "";
        driver.tokenExpirationDate = null;
        await driver.save();

        res.status(200).json({ msg: "Code successfully verified." });
    } else {
        throw new customApiError.UnAuthenticatedError("Invalid token");
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new customApiError.BadRequestError(
            "Please provide your account's email address"
        );
    }
    const driver = await Driver.findOne({ email });
    if (!driver) {
        throw new customApiError.NotFoundError("Driver does not exist");
    }

    const number = Math.floor(Math.random() * 9000) + 1000;
    const passwordToken = number.toString();
    let fiveMinutes = 1000 * 60 * 5;
    const passwordTokenExpirationDate = new Date(Date.now() + fiveMinutes);

    await utils.sendResetPasswordEmail({
        name: driver.firstName,
        email: driver.email,
        passwordToken,
    });

    driver.passwordToken = utils.createHash(passwordToken);
    driver.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await driver.save();

    res.status(200).json({ msg: "Please check your email to reset password" });
};

const resetPassword = async (req, res) => {
    const { password, email } = req.body;
    const driver = await Driver.findOne({ email });
    if (!driver) {
        throw new customApiError.NotFoundError("Driver does not exist");
    }
    if (!password) {
        throw new customApiError.BadRequestError(
            "Please enter your new password"
        );
    }

    driver.password = password;
    driver.passwordToken = null;
    driver.passwordTokenExpirationDate = null;
    await driver.save();

    res.status(200).json({
        msg: "Password reset is successful",
    });
};

const resendEmailToken = async (req, res) => {
    const driver = await Driver.findOne({ email: req.body.email });
    const number = Math.floor(Math.random() * 9000) + 1000;
    const verificationToken = number.toString();
    const tokenExpirationDate = new Date(Date.now() + 5 * 60 * 1000);

    await utils.sendVerificationEmail({
        name: driver.firstName,
        email: driver.email,
        verificationToken,
    });

    driver.verificationToken = utils.createHash(verificationToken);
    driver.tokenExpirationDate = tokenExpirationDate;
    await driver.save();

    res.status(200).json({ msg: "Code successfully sent again." });
};

const verifyPasswordToken = async (req, res) => {
    const { token, email } = req.body;
    const driver = await Driver.findOne({ email });
    if (!driver) throw new customApiError.UnAuthenticatedError("Invalid email");

    let currentDay = new Date(Date.now());
    if (
        driver.passwordToken === utils.createHash(token) &&
        driver.passwordTokenExpirationDate > currentDay
    ) {
        driver.passwordToken = "";
        driver.passwordTokenExpirationDate = null;
        await driver.save();

        res.status(200).json({ msg: "Code successfully verified." });
    } else {
        throw new customApiError.UnAuthenticatedError("Invalid token");
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
    register,
    login,
    forgotPassword,
    verifyPhone,
    resetPassword,
    logout,
    resendEmailToken,
    verifyPasswordToken,
};
