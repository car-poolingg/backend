const Ride = require("../../models/driver.model/ride");
const DriverNotification = require("../../models/driver.model/notification");
const Request = require("../../models/user.model/request");
// const User = require("../../models/user.model/user");
const customApiError = require("../../errors");
const utils = require("../../utils");
const DriverSubscription = require("../../models/driver.model/subscription");

const findRide = async (req, res) => {
    const { pickup, destination, date, time } = req.body;

    const rides = await Ride.find({});
    const userTimeStamp = utils.getTimeStamps(date, time);

    const availableRides = await utils.matchPassengersToDriversWithWaypoints(
        rides,
        pickup,
        destination,
        userTimeStamp
    );

    res.status(200).json({
        message: "Available Rides",
        availableRides,
    });
};

const getRide = async (req, res) => {
    const { id: rideId } = req.params;
    const ride = await Ride.findById(rideId).populate({
        path: "createdBy",
        select: "-password -createdAt -updatedAt -__v",
    });
    if (!ride) throw new customApiError.NotFoundError("Invalid Ride");

    res.status(200).json({ ride, message: "Ride Found" });
};

const sendRideRequest = async (req, res) => {
    const {
        body: { title, information, rideId },
        user: { userId },
    } = req;

    const ride = await Ride.findById(rideId);
    if (!ride) throw new customApiError.NotFoundError("Invalid Ride");

    const driverSubscription = await DriverSubscription.findOne({
        driver: ride.createdBy,
    });
    if (!driverSubscription)
        throw new customApiError.NotFoundError(
            "Driver's subscription not found"
        );

    const request = await Request.create({
        ride: rideId,
        user: userId,
    });
    const notification = await DriverNotification.create({
        request: request._id,
        title,
        information,
        driver: ride.createdBy,
    });

    // a web push notification for driver
    const { endpoint, expirationTime, keys } = driverSubscription;
    const payload = {
        title: "Car Pooling",
        body: "Notified by Leksyking",
        icon: "https://th.bing.com/th/id/R.cc13b308f0ffa05b9e8374133a214a9f?rik=MYSllDTSs0MwKw&pid=ImgRaw&r=0",
    };
    const subscription = { endpoint, expirationTime, keys };
    await utils.subscribe({ subscription, payload });

    res.status(200).json({
        notification,
        request,
        message: "Notification Sent to Driver",
    });
};

module.exports = {
    findRide,
    sendRideRequest,
    getRide,
};
