const jwt = require("jsonwebtoken");
const Admin = require("../models/auth.admin");
const customApiError = require("../errors");

const adminAuthentication = async (req, res, next) => {
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

const authorizePermission = (...accountTypes) => {
    return (req, res, next) => {
        if (!accountTypes.includes(req.user.accountType)) {
            throw new customApiError.UnAuthorizedError(
                "You are not authorized"
            );
        }
        next();
    };
};

module.exports = {
    adminAuthentication,
    authorizePermission,
};
