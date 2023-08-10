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

const getDriverReview = async (req, res) => {
    const driverId = req.params.driverId;
    try{
        const reviews = await Review.findById(driverId)
        if (!reviews) throw new customApiError.NotFoundError("Reviews not found.");
        return res.status(200).send(reviews)

        
    }catch(error){
        throw new customApiError.BadRequestError("Internal Server Error");
    }

}

module.exports = { 
    createReview,
    getDriverReview,
 };
