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

const Register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    //check for email
    const isEmail = await User.findOne({ email });
    if (isEmail) {
        throw new customApiError.BadRequestError("Email exists already");
    }
    //check for first user
    const isFirstUser = (await User.countDocuments()) === 0;
    const role = isFirstUser ? "admin" : "user";
    const number = Math.floor(Math.random() * 90000) + 10000;
    const verificationToken = number.toString();
    const tokenExpirationDate = new Date(Date.now() + 5 * 60 * 1000);
    console.log(verificationToken);

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        verificationToken: utils.CreateHash(verificationToken),
        tokenExpirationDate,
        role,
        fiscalCode,
        interests,
        loyaltyCode,
    });
    //send email verification to user
    await utils.sendVerificationCode({
        name: user.firstName,
        email: user.email,
        verificationToken,
    });

    const tokenUser = utils.CreateToken(user);
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { refreshToken, userAgent, ip, user: user._id };
    await Token.create(userToken);
    utils.attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    res.status(201).json({
        msg: "Success, Please check your email for the verification code",
    });
};

//Set token expiration time

const Login = async (req, res) => {
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
    const tokenUser = utils.CreateToken(user);
    let refreshToken = "";
    const existingToken = await Token.findOne({ user: user._id });
    if (existingToken) {
        const { isValid } = existingToken;
        if (!isValid) {
            throw new customApiError.UnAuthenticatedError("Invalid Details");
        }
        refreshToken = existingToken.refreshToken;
        //attachCookies
        utils.attachCookiesToResponse({ res, user: tokenUser, refreshToken });
        res.status(200).json({ user: tokenUser });
        return;
    }
    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { refreshToken, userAgent, ip, user: user._id };
    //create token
    await Token.create(userToken);
    //attachcookiestoresponse
    utils.attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(200).json({ user: tokenUser });
    return;
};

const Logout = async (req, res) => {
    await Token.findOneAndDelete({ user: req.user.userId });
    res.cookie("accessApp", "logout", {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now()),
    });
    res.cookie("refreshApp", "logout", {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now()),
    });
    res.status(200).json({ msg: "You are logged out." });
};

const ResendCode = async (req, res) => {
    const user = await User.findById(req.user.userId);
    const number = Math.floor(Math.random() * 90000) + 10000;
    const verificationToken = number.toString();
    const tokenExpirationDate = new Date(Date.now() + 5 * 60 * 1000);
    console.log(verificationToken);

    await utils.sendVerificationCode({
        name: user.firstName,
        email: user.email,
        verificationToken,
    });
    user.verificationToken = utils.CreateHash(verificationToken);
    user.tokenExpirationDate = tokenExpirationDate;
    await user.save();
    res.status(200).json({ msg: "Code successfully sent again." });
};

const VerifyToken = async (req, res) => {
    const { token } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
        throw new customApiError.UnAuthenticatedError("Invalid email");
    }
    let currentDay = new Date(Date.now());
    if (
        user.verificationToken === utils.CreateHash(token) &&
        user.tokenExpirationDate > currentDay
    ) {
        user.isVerified = true;
        user.verified = new Date(Date.now());
        user.verificationToken = "";
        user.tokenExpirationDate = null;
        await user.save();
        res.status(200).json({ msg: "Code successfully verified." });
    } else {
        throw new customApiError.UnAuthenticatedError("Invalid token");
    }
};

const ForgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new customApiError.BadRequestError("Please provide your email");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new customApiError.NotFoundError("Please enter a valid email");
    }
    //create cookies
    const tokenUser = utils.CreateToken(user);
    //check for token
    let refreshToken = "";
    const tokenExists = await Token.findOne({ user: user._id });
    if (tokenExists) {
        const { isValid } = tokenExists;
        if (!isValid) {
            throw new customApiError.UnAuthenticatedError("Invalid Details");
        }
        refreshToken = tokenExists.refreshToken;
        utils.attachCookiesToResponse({ res, user: tokenUser, refreshToken });
        const number = Math.floor(Math.random() * 90000) + 10000;
        const verificationToken = number.toString();

        const tokenExpirationDate = new Date(Date.now() + 5 * 60 * 1000);

        await utils.sendVerificationCode({
            name: user.firstName,
            email: user.email,
            verificationToken,
        });
        user.verificationToken = utils.CreateHash(verificationToken);
        user.tokenExpirationDate = tokenExpirationDate;
        await user.save();
        res.status(StatusCodes.OK).json({
            msg: "Check your email for the otp",
        });
        return;
    }
    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { refreshToken, userAgent, ip, user: user._id };
    await Token.create(userToken);
    utils.attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    const number = Math.floor(Math.random() * 90000) + 10000;
    const verificationToken = number.toString();

    const tokenExpirationDate = new Date(Date.now() + 5 * 60 * 1000);

    await utils.sendVerificationCode({
        name: user.firstName,
        email: user.email,
        verificationToken,
    });
    user.verificationToken = utils.CreateHash(verificationToken);
    user.tokenExpirationDate = tokenExpirationDate;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: "Check your email for the otp" });
};

const ResetPassword = async (req, res) => {
    const { password } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
        throw new customApiError.NotFoundError("User does not exist");
    }
    if (!password) {
        throw new customApiError.BadRequestError(
            "Please enter your new password"
        );
    }
    user.password = password;
    await user.save();
    res.status(200).json({ msg: "Password reset is successful" });
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