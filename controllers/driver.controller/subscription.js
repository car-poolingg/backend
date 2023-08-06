const DriverSubscription = require("../../models/driver.model/subscription");

const subscribe = async (req, res) => {
    const { endpoint, expirationTime, keys } = req.body;

    const subscription = await DriverSubscription.create({
        driver: req.user.userId,
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
