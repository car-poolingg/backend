const createTokenUser = require("./createTokenUser");
const createTokenDriver = require("./createTokenDriver");
const { isTokenValid, createJWT } = require("./jwt");
const sendVerificationEmail = require("./sendVerificationMail");
const sendResetPasswordEmail = require("./sendResetPasswordMail");
const sendNotificationEmail = require("./sendNotificationEmail");
const sendContactUsEmail = require("./sendContactUsEmail");
const uploadImage = require("./cloudinary");
const subscribe = require("./webPush");
const createHash = require("./createHash");
const { checkPermission, driverPermission } = require("./checkPermission");
const sendSmsOTP = require("./sms");
const { matchPassengersToDriversWithWaypoints, getTimeStamps } = require("./maps");

module.exports = {
    createTokenUser,
    createTokenDriver,
    isTokenValid,
    createJWT,
    sendVerificationEmail,
    sendResetPasswordEmail,
    sendNotificationEmail,
    sendContactUsEmail,
    createHash,
    checkPermission,
    driverPermission,
    uploadImage,
    sendSmsOTP,
    subscribe,
    matchPassengersToDriversWithWaypoints,
    getTimeStamps,
};
