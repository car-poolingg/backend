const fetch = require("node-fetch");

const maxProximityDistance = 5;
const maxTimeDifference = 1000 * 60 * 10;
const requiredSeats = 1;

const apiKey = process.env.BING_MAPS_API_KEY;

async function getRoute(origin, destination) {
    const apiUrl = `https://dev.virtualearth.net/REST/V1/Routes/Driving?o=json&wp.0=${encodeURIComponent(
        origin
    )}&wp.1=${encodeURIComponent(
        destination
    )}&routePathOutput=Points&key=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    return data.resourceSets[0].resources[0];
}

const matchPassengersToDriversWithWaypoints = async (
    rides,
    pickup,
    destination,
    userTimeStamp
) => {
    const availableRides = [];

    for (const ride of rides) {
        const driverRoute = await getRoute(ride.location, ride.destination);
        const passengerRoute = await getRoute(pickup, destination);

        const driverWaypoints = extractWaypoints(driverRoute);
        const passengerWaypoints = extractWaypoints(passengerRoute);

        const commonWaypoints = findCommonWaypoints(
            driverWaypoints,
            passengerWaypoints
        );

        const driverTimeStamp = getTimeStamps(ride.date, ride.time);

        for (const waypoint of commonWaypoints) {
            if (
                isWithinProximity(ride, waypoint, maxProximityDistance) &&
                isWithinTimeWindow(
                    driverTimeStamp,
                    userTimeStamp,
                    maxTimeDifference
                ) &&
                ride.availableSeats >= requiredSeats
            ) {
                availableRides.push(ride);
                break;
            }
        }
    }

    return availableRides;
};

function extractWaypoints(route) {
    return route.routePath.line.coordinates.map((coord) => ({
        lat: coord[0],
        lng: coord[1],
    }));
}

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

function getTimeStamps(dateStr, timeStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hours, minutes] = timeStr.split(":").map(Number);

    const DateTime = new Date(year, month - 1, day, hours, minutes);
    return DateTime.getTime();
}

function isWithinProximity(ride, waypoint, maxProximityDistance) {
    const distance = calculateDistance(ride.location, waypoint);
    return distance <= maxProximityDistance;
}

function calculateDistance(coord1, coord2) {
    const R = 6371;

    const lat1 = degToRad(coord1[0]);
    const lat2 = degToRad(coord2.lat);
    const lon1 = degToRad(coord1[1]);
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

    const distance = R * c;
    return distance;
}

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

function isWithinTimeWindow(driverTimestamp, userTimeStamp, maxTimeDifference) {
    const timeDifference = Math.abs(driverTimestamp - userTimeStamp);
    return timeDifference <= maxTimeDifference;
}

function areWaypointsEqual(waypoint1, waypoint2, tolerance = 0.001) {
    const latDiff = Math.abs(waypoint1.lat - waypoint2.lat);
    const lngDiff = Math.abs(waypoint1.lng - waypoint2.lng);
    return latDiff <= tolerance && lngDiff <= tolerance;
}

module.exports = {
    matchPassengersToDriversWithWaypoints,
    getTimeStamps,
};
