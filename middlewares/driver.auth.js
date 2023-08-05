const customApiError = require("../errors");
const { isTokenValid } = require("../utils");

const driverAuthentication = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            throw new customApiError.UnAuthenticatedError("Invalid Request");
        }
        const token = authHeader.split(" ")[1];

        const { userId, email, role } = isTokenValid(token);
        req.user = { userId, email, role };

        return next();
    } catch (error) {
        throw new customApiError.UnAuthenticatedError("Invalid Authentication");
    }
};

module.exports = driverAuthentication;
