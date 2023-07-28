const customApiError = require("../errors");
const { isTokenValid } = require("../utils");

const userAuthentication = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            throw new UnauthenticatedError("Invalid Request");
        }
        const token = authHeader.split(" ")[1];

        const payload = isTokenValid(token);
        req.user = {
            userId: payload.userId,
            name: payload.username,
            role: payload.role,
        };

        return next();
    } catch (error) {
        throw new customApiError.UnAuthenticatedError("Invalid Authentication");
    }
};

module.exports = userAuthentication;
