const { Schema, model, Types } = require("mongoose");

const RideSchema = new Schema(
    {
        location: {
            type: [Number],
            required: true,
        },
        destination: {
            type: [Number],
            required: true,
        },
        date: {
            type: String,
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
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

RideSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "driver",
    localField: "createdBy",
    justOne: true,
});

module.exports = model("Ride", RideSchema);
