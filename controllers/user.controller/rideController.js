const Ride = require("../../models/driver.model/ride");
const DriverNotification = require("../../models/driver.model/notification");
const Request = require("../../models/user.model/request");
const User = require("../../models/user.model/user");
const customApiError = require("../../errors");

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
    // a web push notification

    res.status(200).json({
        notification,
        request,
        message: "Success",
    });
};

module.exports = {
    findRide,
    sendRideRequest,
};
