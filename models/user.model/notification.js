const { Schema, model, Types } = require("mongoose");

const NotificationSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: "User",
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
    },
    { timestamps: true }
);

module.exports = model("Notification", NotificationSchema);
