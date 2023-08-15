const { set, connect } = require("mongoose");

const connectDB = async () => {
    set("strictQuery", true);
    return connect(process.env.NODE_ENV == "local" ? process.env.DB_CONNECTION_DEV : process.env.DB_CONNECTION_PROD);
};
module.exports = connectDB;
