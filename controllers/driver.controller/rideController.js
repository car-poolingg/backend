const Ride = require("../../models/driver.model/ride");
const Driver = require("../../models/driver.model/driver");
const utils = require("../../utils");
const customApiError = require("../../errors");
const DriverNotification = require("../../models/driver.model/notification");
const UserNotification = require("../../models/user.model/notification");
const Request = require("../../models/user.model/request");
const UserSubscription = require("../../models/user.model/subscription");

const postRide = async (req, res) => {
    const driver = await Driver.findById(req.driver.driverId);
    utils.driverPermission(req.user, driver);

    req.body.createdBy = req.driver.driverId;
    const ride = await Ride.create(req.body);

    res.status(200).json({
        ride,
        message: "Success",
    });
};

const updateRideRequest = async (req, res) => {
    const {
        user: { driverId },
        params: { id: NotificationId },
        query: { status },
        body: { title },
    } = req;

    const driver = await Driver.findById(driverId);
    utils.driverPermission(req.driver, driver);

    const driverNotification = await DriverNotification.findOne({
        _id: NotificationId,
        driver: driverId,
    });
    driverNotification.status = status;
    await driverNotification.save();

    const request = await Request.findById(driverNotification.request);
    if (!request) throw new customApiError.NotFoundError("Invalid request");
    request.status = `${status}ed`;
    await request.save();

    let message = `Driver - ${driver.firstName} ${status}ed your request. contact him via ${driver.phone} `;
    const userNotification = await UserNotification.create({
        user: request.user,
        title,
        information: message,
    });

    const userSubscription = await UserSubscription.findOne({
        user: request.user,
    });
    if (!userSubscription) throw new customApiError.NotFoundError("User's subscription not found");

    // a web push notification for driver
    const { endpoint, expirationTime, keys } = userSubscription;
    const payload = {
        title: "Car Pooling",
        body: "Notified by Leksyking",
        icon: "https://th.bing.com/th/id/R.cc13b308f0ffa05b9e8374133a214a9f?rik=MYSllDTSs0MwKw&pid=ImgRaw&r=0",
    };

    const subscription = { endpoint, expirationTime, keys };
    await utils.subscribe({ subscription, payload });

    res.status(200).json({
        driverNotification,
        userNotification,
        message: "Success",
    });
};

module.exports = {
    postRide,
    updateRideRequest,
};
