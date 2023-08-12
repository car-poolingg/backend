const createTokenUser = require("./createTokenUser");
const { isTokenValid, createJWT } = require("./jwt");
const sendVerificationEmail = require("./sendVerificationMail");
const sendResetPasswordEmail = require("./sendResetPasswordMail");
const sendNotificationEmail = require("./sendNotificationEmail");
const sendContactUsEmail = require("./sendContactUsEmail");
const cloudinary = require("./cloudinary");
const subscribe = require("./webPush");
const createHash = require("./createHash");
const { checkPermission, driverPermission } = require("./checkPermission");
const sendSmsOTP = require("./sms");
const {
    matchPassengersToDriversWithWaypoints,
    getTimeStamps,
} = require("./maps");

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
    subscribe,
    matchPassengersToDriversWithWaypoints,
    getTimeStamps,
};
