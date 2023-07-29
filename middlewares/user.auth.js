const customApiError = require("../errors");
const { isTokenValid } = require("../utils");

const userAuthentication = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) return next();

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            throw new customApiError.UnAuthenticatedError("Invalid Request");
        }
        const token = authHeader.split(" ")[1];

        const { userId, username, role } = isTokenValid(token);
        req.user = { userId, username, role };

        return next();
    } catch (error) {
        throw new customApiError.UnAuthenticatedError("Invalid Authentication");
    }
};

module.exports = userAuthentication;
