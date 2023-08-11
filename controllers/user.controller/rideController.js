const Ride = require("../../models/driver.model/ride");
const DriverNotification = require("../../models/driver.model/notification");
const Request = require("../../models/user.model/request");
const User = require("../../models/user.model/user");
const customApiError = require("../../errors");
const utils = require("../../utils");
const DriverSubscription = require("../../models/driver.model/subscription");
// const fetch = require("node-fetch");

const findRide = async (req, res) => {
    const { pickup, destination, date, time } = req.body;

    // Sample driver data
    const drivers = await Ride.find({});

    const availableRides = [];
    // crosscheck  with time and date and available seats

    // Bing Maps API key
    const apiKey =
        "AsmOnsw2KxZ7cpOuLsldQ4jnqAIAp5JdvqLT2KQoAyztVOQYyGPjUgxCVk0bhkQE";

    // Function to get route using Bing Maps API
    async function getRoute(origin, destination) {
        const apiUrl = `https://dev.virtualearth.net/REST/V1/Routes/Driving?o=json&wp.0=${encodeURIComponent(
            origin
        )}&wp.1=${encodeURIComponent(
            destination
        )}&routePathOutput=Points&key=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            return data.resourceSets[0].resources[0];
        } catch (error) {
            console.error("Error fetching route:", error);
            throw error;
        }
    }

    // Function to extract waypoints from a route
    function extractWaypoints(route) {
        return route.routePath.line.coordinates.map((coord) => ({
            lat: coord[0],
            lng: coord[1],
        }));
    }

    // // Function to find common waypoints between driver and passenger routes
    function findCommonWaypoints(driverWaypoints, passengerWaypoints) {
        const commonWaypoints = [];

        for (const driverWaypoint of driverWaypoints) {
            for (const passengerWaypoint of passengerWaypoints) {
                if (
                    areWaypointsEqual(driverWaypoint, passengerWaypoint) &&
                    !commonWaypoints.includes(driverWaypoint)
                ) {
                    commonWaypoints.push(driverWaypoint);
                }
            }
        }

        return commonWaypoints;
    }

    // Function to check if two waypoints are equal (within tolerance)
    function areWaypointsEqual(waypoint1, waypoint2, tolerance = 0.001) {
        const latDiff = Math.abs(waypoint1.lat - waypoint2.lat);
        const lngDiff = Math.abs(waypoint1.lng - waypoint2.lng);
        return latDiff <= tolerance && lngDiff <= tolerance;
    }

    // // Function to match passengers to drivers considering waypoints
    async function matchPassengersToDriversWithWaypoints(drivers) {
        const matchedRides = [];

        for (const driver of drivers) {
            const driverRoute = await getRoute(
                driver.location,
                driver.destination
            );
            const passengerRoute = await getRoute(pickup, destination);

            const driverWaypoints = extractWaypoints(driverRoute);
            const passengerWaypoints = extractWaypoints(passengerRoute);

            const commonWaypoints = findCommonWaypoints(
                driverWaypoints,
                passengerWaypoints
            );

            for (const waypoint of commonWaypoints) {
                if (isWithinProximity(driver, waypoint)) {
                    const matchedRide = {
                        passenger: req.user.userId,
                        driver: drivers.createdBy,
                        pickup,
                        destination,
                        waypoint,
                        date,
                        time,
                    };
                    matchedRides.push(matchedRide);
                    availableRides.push(driver);
                }
            }
        }

        return matchedRides;
    }

    // // Function to check if a waypoint is within proximity to a driver
    function isWithinProximity(driver, waypoint) {
        // Implement proximity calculation logic here
        return true; // Return true if within proximity, otherwise false
    }

    // Call the matchPassengersToDriversWithWaypoints function
    const matchedRides = await matchPassengersToDriversWithWaypoints(drivers);
    // console.log(matchedRides);
    // console.log(availableRides);

    res.status(200).json({
        availableRides,
        matchedRides,
        message: "Notification Sent to Driver",
    });
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
};
