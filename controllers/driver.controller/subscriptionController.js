const DriverSubscription = require("../../models/driver.model/subscription");

const subscribe = async (req, res) => {
    const { endpoint, expirationTime, keys } = req.body;

    let subscription = await DriverSubscription.find({
        driver: req.driver.driverId,
    });
    if (subscription) {
        subscription = await DriverSubscription.findOneAndUpdate({ driver: req.driver.driverId }, req.body, { new: true, runValidators: true });
    } else {
        subscription = await DriverSubscription.create({
            driver: req.driver.driverId,
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
