const { Schema, model, Types } = require("mongoose");

const NotificationSchema = new Schema(
    {
        request: {
            type: Types.ObjectId,
            ref: "Request",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        information: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "NULL",
        },
        driver: {
            type: Types.ObjectId,
            ref: "Driver",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = model("Notification", NotificationSchema);
