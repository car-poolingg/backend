const UserSubscription = require("../../models/user.model/subscription");

const subscribe = async (req, res) => {
    const { endpoint, expirationTime, keys } = req.body;

    const subscription = await UserSubscription.create({
        user: req.user.userId,
        endpoint,
        expirationTime,
        keys,
    });

    res.status(201).json({
        subscription,
        message: "Success",
    });
};

module.exports = subscribe;
