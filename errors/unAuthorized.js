const CustomAPIError = require("./customApiError");
const { StatusCodes } = require("http-status-codes");

class UnAuthorizedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

module.exports = UnAuthorizedError;
