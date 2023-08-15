const { StatusCodes } = require("http-status-codes");

const ErrorHandlerMiddleware = async (err, req, res, next) => {
    let customError = {
        status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Oops!, Something went wrong, try again later...",
    };

    if (err.response) {
        customError.message = err.response.data.message;
    }
    if (err.name === "CastError") {
        customError.status = StatusCodes.NOT_FOUND;
        customError.message = `id: ${err.value}, does not exist.`;
    }

    if (err.code === 11000) {
        customError.status = StatusCodes.BAD_REQUEST;
        customError.message = `${Object.keys(err.keyValue)} has already been used.`;
    }

    console.log(err);
    return res.status(customError.status).json({
        data: [],
        message: customError.message,
        status: "failed",
    });
};

module.exports = ErrorHandlerMiddleware;
