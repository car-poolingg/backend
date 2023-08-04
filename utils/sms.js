const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const sendSmsOTP = async ({ code, phone }) => {
    await client.messages.create({
        body: `Hi!, your otp is ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
    });
};

module.exports = sendSmsOTP;