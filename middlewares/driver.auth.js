const customApiError = require("../errors");
const { isTokenValid } = require("../utils");

const driverAuthentication = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new customApiError.UnAuthenticatedError("Invalid Request");
    }
    const token = authHeader.split(" ")[1];

    const { driverId, email, role } = isTokenValid(token);

    if (role !== "driver") throw new customApiError.UnAuthenticatedError("Invalid Authentication: You are not a driver");

    req.driver = { driverId, email, role };

    return next();
};

module.exports = driverAuthentication;
