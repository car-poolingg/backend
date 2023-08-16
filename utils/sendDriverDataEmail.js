const SendEmail = require("./sendGrid");

const sendDriverDataEmail = async (email, attachment) => {
    const msg = {
        from: "gbemilekeogundipe@gmail.com",
        subject: "Lists of drivers' data ",
        to: email,
        text: "Here is the list of drivers' data",
        attachments: [
            {
                content: attachment,
                filename: "drivers.csv",
                type: "application/csv",
                disposition: "attachment",
            },
        ],
    };
    return SendEmail.send(msg);
};

module.exports = sendDriverDataEmail;
