const customApiError = require("../errors");
const { isTokenValid } = require("../utils");

const userAuthentication = async (req, res, next) => {
    if (req.isAuthenticated()) return next();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new customApiError.UnAuthenticatedError("Invalid Request");
    }
    const token = authHeader.split(" ")[1];

    const { userId, email, role } = isTokenValid(token);

    if (role !== "passenger")
        throw new customApiError.UnAuthenticatedError(
            "Invalid Authentication: You are not a passenger"
        );
    req.user = { userId, email, role };

    return next();
};

module.exports = userAuthentication;
