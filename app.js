require("dotenv").config();

require("express-async-errors");

const express = require("express");

const app = express();

const cors = require("cors");

const fileupload = require("express-fileupload");

// Use Express Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileupload({ useTempFiles: true }));

// Declare Routes
// app.use("/api/v1/contact", require("./routes/contact/index"));

app.use("/", (req, res) => {
  res.send("Welcome to OAU Car-Pooling...");
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
