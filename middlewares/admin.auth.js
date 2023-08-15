const customApiError = require("../errors");

const adminAuthentication = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new customApiError.UnAuthenticatedError("Invalid Authentication");
    }
    const token = authHeader.split(" ")[1];

    const { userId, email, role } = isTokenValid(token);

    if (role !== "admin") throw new customApiError.UnAuthenticatedError("Invalid Authentication: You are not an admin");
    req.user = { userId, email, role };

    return next();
};

const authorizePermission = (...accountTypes) => {
    return (req, res, next) => {
        if (!accountTypes.includes(req.user.accountType)) {
            throw new customApiError.UnAuthorizedError("You are not authorized");
        }
        next();
    };
};

module.exports = {
    adminAuthentication,
    authorizePermission,
};
