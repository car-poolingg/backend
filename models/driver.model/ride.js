const { Schema, model, Types } = require("mongoose");

const RideSchema = new Schema(
    {
        location: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            },
        },
        destination: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            },
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        availableSeats: {
            type: Number,
            required: true,
        },
        rideDetails: {
            type: String,
        },
        createdBy: {
            type: Types.ObjectId,
            ref: "Driver",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = model("Ride", RideSchema);
