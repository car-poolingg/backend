// contains the logic that processes the requests and interacts with the models
const mongoose = require('mongoose')
const Review = require('.../models/user.model/review.js');
const User = require('.../models/user.model/user.js');

async function reviewController(req,res){
    try{

        const { comment, rating, userId} = req.body
        const user = User.findById(userId)
        if(!user){
            return res.status(404).json({error: 'user not found '})
        }

        const review = new Review({
            comment,rating,userId
        })

        review.save()

        res.status(201).json({ msg: "Review submitted successfully."});
    }catch(error){
        res.status(500).json({error: 'internal server errror'})
    }
    

}

module.exports ={reviewController}