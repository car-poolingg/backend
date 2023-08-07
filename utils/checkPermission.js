const CustomApiError = require("../errors");

const checkPermission = (requestUser, userId) => {
    if (requestUser.role === "admin") return;
    if (requestUser.userId === userId.toString()) return;
    throw new CustomApiError.UnAuthorizedError(
        "You are not authorized to access this route"
    );
};

const driverPermission = (requestUser, user) => {
    if (requestUser.userId === user._id.toString() && user.isVerified.cleared)
        return;
    throw new CustomApiError.UnAuthorizedError(
        "You are not authorized to access this route"
    );
};

module.exports = {
    checkPermission,
    driverPermission,
};
