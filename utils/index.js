const createTokenUser = require("./createTokenUser");
const { isTokenValid, createJWT } = require("./jwt");
const sendVerificationEmail = require("./sendVerificationMail");
const sendResetPasswordEmail = require("./sendResetPasswordMail");
const sendNotificationEmail = require("./sendNotificationEmail");
const sendContactUsEmail = require("./sendContactUsEmail");
const cloudinary = require("./cloudinary");
const createHash = require("./createHash");
const { checkPermission, driverPermission } = require("./checkPermission");
const sendSmsOTP = require("./sms");

module.exports = {
    createTokenUser,
    isTokenValid,
    createJWT,
    sendVerificationEmail,
    sendResetPasswordEmail,
    sendNotificationEmail,
    sendContactUsEmail,
    createHash,
    checkPermission,
    driverPermission,
    cloudinary,
    sendSmsOTP,
};
