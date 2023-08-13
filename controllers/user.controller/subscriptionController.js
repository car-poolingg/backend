const UserSubscription = require("../../models/user.model/subscription");

const subscribe = async (req, res) => {
    const { endpoint, expirationTime, keys } = req.body;

    let subscription = await UserSubscription.findOne({
        user: req.user.userId,
    });
    if (!subscription) {
        subscription = await UserSubscription.findOneAndUpdate({ user: req.user.userId }, req.body, { new: true, runValidators: true });
    } else {
        subscription = await UserSubscription.create({
            user: req.user.userId,
            endpoint,
            expirationTime,
            keys,
        });
    }

    res.status(201).json({
        subscription,
        message: "Success",
    });
};

module.exports = subscribe;
