const SendEmail = require("./sendGrid");

const sendVerificationCode = async ({ name, email, passwordToken }) => {
    const msg = {
        from: "gbemilekeogundipe@gmail.com",
        template_id: process.env.SENDGRID_RESET_ID,
        personalizations: [
            {
                to: { email },
                dynamic_template_data: {
                    subject: "Reset password",
                    username: name,
                    reset_password: passwordToken,
                },
            },
        ],
    };
    return SendEmail.send(msg);
};

module.exports = sendVerificationCode;
