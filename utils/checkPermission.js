const CustomApiError = require("../errors");

const checkPermission = (requestUser, userId) => {
    if (requestUser.role === "admin") return;
    if (requestUser.userId === userId.toString()) return;
    throw new CustomApiError.UnAuthorizedError("You are not authorized to access this route");
};

const driverPermission = (requestDriver, driver) => {
    if (requestDriver.driverId === driver._id.toString() && driver.isVerified.cleared) return;
    throw new CustomApiError.UnAuthorizedError("You are not authorized to access this route");
};

module.exports = {
    checkPermission,
    driverPermission,
};
