const customApiError = require("../errors");
const { isTokenValid } = require("../utils");

const userAuthentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const payload = isTokenValid(token);
    req.user = { userId: payload.userId, name: payload.name };

    return next();
  } catch (error) {
    throw new customApiError.UnAuthenticatedError("Invalid Authentication");
  }
};

module.exports = userAuthentication;
