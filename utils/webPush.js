const webpush = require("web-push");
const { subscribe } = require("../routes/user/auth");

const publicVapidKey = process.env.PUBLICVAPIDKEY;
const privateVapidKey = process.env.PRIVATEVAPIDKEY;

webpush.setVapidDetails(
    "mailto:test@test.com",
    publicVapidKey,
    privateVapidKey
);

const subscribe = async ({ subscription, payload }) => {
    return webpush.sendNotification(subscription, JSON.stringify(payload));
};

module.exports = subscribe;
