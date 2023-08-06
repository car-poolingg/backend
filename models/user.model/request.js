const { Schema, model, Types } = require("mongoose");

const RequestSchema = new Schema(
    {
        ride: {
            type: Types.ObjectId,
            ref: "Ride",
            required: true,
        },
        status: {
            type: String,
            default: "pending",
        },
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = model("Request", RequestSchema);
