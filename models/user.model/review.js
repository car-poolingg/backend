const { Schema, model, Types } = require("mongoose");

const reviewSchema = new Schema(
    {
        comment: {
            type: String,
        },
        rating: {
            type: Number,
        },
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        driver: {
            type: Types.ObjectId,
            ref: "Driver",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = model("Review", reviewSchema);
