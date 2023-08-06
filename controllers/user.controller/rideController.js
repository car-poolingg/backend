const Ride = require("../../models/driver.model/ride");
const DriverNotification = require("../../models/driver.model/notification");
const Request = require("../../models/user.model/request");
const User = require("../../models/user.model/user");
const customApiError = require("../../errors");
const utils = require("../../utils");
const DriverSubscription = require("../../models/driver.model/subscription");

const findRide = async (req, res) => {
    return new Date(date + "GMT+0");
    // fetch()
    //     const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
    // const origin = 'Starting Location';
    // const destination = 'Destination Location';

    // // Construct the URL for the Directions API request
    // )    // const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

    // // Call the Google Maps Directions API using Fetch API
    // fetch(apiUrl)
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok.');
    //     }user
    //     return response.json();
    //   })
    //   .then((data) => {
    //     // Process the Directions API response data here
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching data:', error);
    //   });
};

const sendRideRequest = async (req, res) => {
    const {
        body: { title, information, rideId },
        user: { userId },
    } = req;

    const ride = await Ride.findById(rideId);
    if (!ride) throw new customApiError.NotFoundError("Invalid Ride");

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
    const payload = {
        title,
        body: information,
        icon: "",
    };
    const driverSubscription = await DriverSubscription.findOne({
        driver: ride.createdBy,
    });
    if (!driverSubscription)
        throw new customApiError.NotFoundError(
            "Driver's subscription not found"
        );

    const { endpoint, expirationTime, keys } = driverSubscription;
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
};
