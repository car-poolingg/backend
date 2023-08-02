// This directory contains individual model files (e.g., user.model.js, carpool.model.js, review.model.js) that define the schemas for different entities in your application

const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
    {
        comment: {
            type: String,
        },
        rating: {
            type: Number,
        },
        
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);




module.exports = mongoose.model("Review", reviewSchema);
