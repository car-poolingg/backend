const Ride = require("../../models/driver.model/ride");
const DriverNotification = require("../../models/driver.model/notification");
const Request = require("../../models/user.model/request");
// const User = require("../../models/user.model/user");
const customApiError = require("../../errors");
const utils = require("../../utils");
const DriverSubscription = require("../../models/driver.model/subscription");
const fetch = require("node-fetch");

const findRide = async (req, res) => {
    const { pickup, destination, date, time } = req.body;
    const maxDistance = 5; // Maximum distance in kilometers
    const maxTimeDifference =
        1000 * 60 * 10; /* Maximum time difference allowed in milliseconds */
    const requiredSeats = 1; /* Number of seats required by passenger */

    // Sample driver data
    const drivers = await Ride.find({});

    // crosscheck  with time and date and available seats
    const userTimeStamp = getTimeStamps(date, time);

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
        const availableRides = [];

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

            const driverTimestamp = getTimeStamps(driver.date, driver.time);

            for (const waypoint of commonWaypoints) {
                if (
                    isWithinProximity(driver, waypoint, maxDistance) &&
                    isWithinTimeWindow(
                        driverTimestamp,
                        userTimeStamp,
                        maxTimeDifference
                    ) &&
                    driver.availableSeats >= requiredSeats
                ) {
                    availableRides.push(driver);
                    break;
                }
            }
        }

        return availableRides;
    }

    // Function to check if a driver is within proximity of a waypoint
    function isWithinProximity(driver, waypoint, maxDistance) {
        const distance = calculateDistance(driver.location, waypoint);
        return distance <= maxDistance;
    }

    // Function to check if time difference is within specified threshold
    function isWithinTimeWindow(departureTime, UserTime, maxTimeDifference) {
        const timeDifference = Math.abs(departureTime - UserTime);
        return timeDifference <= maxTimeDifference;
    }

    function calculateDistance(coord1, coord2) {
        const R = 6371; // Earth's radius in kilometers

        const lat1 = degToRad(coord1.lat);
        const lat2 = degToRad(coord2.lat);
        const lon1 = degToRad(coord1.lng);
        const lon2 = degToRad(coord2.lng);

        const dlat = lat2 - lat1;
        const dlon = lon2 - lon1;

        const a =
            Math.sin(dlat / 2) * Math.sin(dlat / 2) +
            Math.cos(lat1) *
                Math.cos(lat2) *
                Math.sin(dlon / 2) *
                Math.sin(dlon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in kilometers
        return distance;
    }

    function getTimeStamps(dateStr, timeStr) {
        // Parse the date string and time string
        const [year, month, day] = dateStr.split("-").map(Number);
        const [hours, minutes] = timeStr.split(":").map(Number);

        const DateTime = new Date(year, month - 1, day, hours, minutes);
        return DateTime.getTime(); // Timestamp in milliseconds
    }

    // Function to convert degrees to radians
    function degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Call the matchPassengersToDriversWithWaypoints function
    const availableRides = await matchPassengersToDriversWithWaypoints(drivers);
    // console.log(availableRides);

    res.status(200).json({
        availableRides,
        message: "Notification Sent to Driver",
    });
};

const getRide = async (req, res) => {
    //populate with driver details
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
