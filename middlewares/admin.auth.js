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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Admin.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user)
      throw new customApiError.UnAuthenticatedError("Authentication failed");

    req.user = user;

    return next();
  } catch (error) {
    throw new customApiError.UnAuthenticatedError("Invalid Authentication");
  }
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
