const axios = require("axios");

const sendSmsOTP = async ({ code, phone }) => {
    let message = `Your code is: ${code}`;
    let name = "Car Pooling";
    let config = {
        method: "post",
        url: `${process.env.TERMII_BASE_URL}?to=${phone}&from=${name}&sms=${message}&type=plain&channel=generic&api_key=${process.env.TERMII_API_KEY}`,
        headers: {
            "api-key": process.env.TERMII_API_KEY,
        },
    };

    await axios(config);
};

module.exports = sendSmsOTP;
