const SendEmail = require("./sendGrid");

const sendVerificationEmail = async ({name, email, verificationToken, origin}) => {
    const verifyEmail = `${origin}/verify-email?email=${email}&token=${verificationToken}`;
    const msg = {
        from: "gbemilekeogundipe@gmail.com",
        template_id: process.env.SENDGRID_VERIF_ID,
        personalizations: [{
            to: {email},
            dynamic_template_data: {
                subject: "Email verification",
                username: name,
                verify_email: verifyEmail
            }
        }]
    };
    return SendEmail.send(msg);
}

module.exports = sendVerificationEmail;