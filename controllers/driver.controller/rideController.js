const Ride = require("../../models/driver.model/ride");
const Driver = require("../../models/driver.model/driver");
const utils = require("../../utils");

const postRide = async (req, res) => {
    const driver = await Driver.findById(req.user.userId);
    utils.driverPermission(req.user, driver);
    // 2020-03-12
    // HH:MM:SS
    return new Date(date + "GMT+0");
};

const updateRideRequest = async (req, res) => {
    const driver = await Driver.findById(req.user.userId);
    utils.driverPermission(req.user, driver);
    return new Date(date + "GMT+0");
    //create a notification for user and a web push notification
};

module.exports = {
    postRide,
    updateRideRequest,
};
