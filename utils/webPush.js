const webpush = require("web-push");

const publicVapidKey = process.env.PUBLICVAPIDKEY;
const privateVapidKey = process.env.PRIVATEVAPIDKEY;

webpush.setVapidDetails(
    "mailto:test@test.com",
    publicVapidKey,
    privateVapidKey
);

const subscribe = ({ subscription, payload }) => {
    let Payload = JSON.stringify(payload);
    webpush
        .sendNotification(subscription, Payload)
        .catch((err) => console.error(err));
    return;
};

module.exports = subscribe;
