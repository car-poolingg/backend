const DriverSubscription = require("../../models/driver.model/subscription");

const subscribe = async (req, res) => {
    const { endpoint, expirationTime, keys } = req.body;

    let subscription = await DriverSubscription.find({
        driver: req.user.userId,
    });
    if (subscription) {
        subscription = await DriverSubscription.findOneAndUpdate(
            { driver: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );
    } else {
        subscription = await DriverSubscription.create({
            driver: req.user.userId,
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
