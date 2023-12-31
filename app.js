require("dotenv").config();
require("express-async-errors");
const express = require("express");
const path = require("path");

const app = express();
const cors = require("cors");
const expressFormidable = require("express-formidable-v2");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

const tenDays = 1000 * 60 * 60 * 24 * 30;

// Use Express Middleware
// Set static path
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressFormidable({ multiples: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        maxAge: new Date(Date.now() + tenDays),
        store: MongoStore.create({
            mongoUrl: process.env.DB_CONNECTION_PROD,
            collectionName: "sessions",
        }),
    })
);
app.use(passport.initialize());
app.use(passport.session());

require("./controllers/user.controller/passportController");
// #

// User Routes
app.use("/api/v1/auth", require("./routes/user/auth"));
app.use("/api/v1/review", require("./routes/user/review"));
app.use("/api/v1/ride", require("./routes/user/ride"));
app.use("/api/v1/subscribe", require("./routes/user/subscription"));
app.use("/api/v1/user", require("./routes/user/user"));
app.use("/api/v1/notify", require("./routes/user/notifications"));

// Driver Routes
app.use("/api/v1/driver-auth", require("./routes/driver/auth"));
app.use("/api/v1/driver-ride", require("./routes/driver/ride"));
app.use("/api/v1/driver-subscribe", require("./routes/driver/subscription"));
app.use("/api/v1/driver", require("./routes/driver/driver"));
app.use("/api/v1/driver-notify", require("./routes/driver/notifications"));

app.use("/", (req, res) => {
    res.send("Welcome to OAU Car-Pooling app...");
});
app.use(require("./middlewares/notFoundMiddleware"));
app.use(require("./middlewares/errorHandlerMiddleware"));

const connectDB = require("./db/database");
const PORT = process.env.PORT || 4400;

const start = async () => {
    try {
        await connectDB();
        console.log("Successfully connected to the database");
        app.listen(PORT);
        console.log(`Listening to ${PORT}:${PORT}`);
    } catch (error) {
        console.log(error);
    }
};
start();
