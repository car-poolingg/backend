const Review = require("../../models/user.model/review.js");
const User = require("../../models/user.model/user.js");
const customApiError = require("../../errors");

const createReview = async (req, res) => {
    const {
        body: { comment, rating, driver },
        user: { userId },
    } = req;

    const user = await User.findById(userId);
    if (!user) throw new customApiError.NotFoundError("User not found.");

    const review = await Review.create({ comment, rating, userId, driver });

    res.status(201).json({ review, msg: "Review submitted successfully." });
};

module.exports = { createReview };
