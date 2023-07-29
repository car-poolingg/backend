const createTokenUser = require("./createTokenUser");
const { isTokenValid, createJWT } = require("./jwt");
const sendVerificationCode = require("./sendVerificationMail");
const sendResetPasswordEmail = require("./sendResetPasswordMail");
const sendNotificationEmail = require("./sendNotificationEmail");
const sendContactUsEmail = require("./sendContactUsEmail");
const sendSuccessfulOrdersEmail = require("./sendSuccessOrderMail");
const sendTrackingNumberEmail = require("./sendTrackingNumberMail");
const cloudinary = require("./cloudinary");
const createHash = require("./createHash");
const checkPermission = require("./checkPermission");

module.exports = {
    createTokenUser,
    isTokenValid,
    createJWT,
    sendVerificationCode,
    sendResetPasswordEmail,
    sendNotificationEmail,
    sendContactUsEmail,
    sendSuccessfulOrdersEmail,
    sendTrackingNumberEmail,
    createHash,
    checkPermission,
    cloudinary,
};
