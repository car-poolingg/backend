const mongoose = require("mongoose");

const connectDB = async () => {
    mongoose.set("strictQuery", true);
    return mongoose.connect("mongodb+srv://leksyking:WxcrdxZLvlkfUT5h@cluster0.3mamy9w.mongodb.net/carpooling?retryWrites=true&w=majority");
};
module.exports = connectDB;
// process.env.NODE_ENV == "local" ? process.env.DB_CONNECTION_DEV : process.env.DB_CONNECTION_PROD);
