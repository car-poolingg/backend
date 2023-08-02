// handles the incoming HTTP requests related to the corresponding entity

const express = require("express");
const router = express.Router();
const { reviewController }= require("../../controllers/user.controller/reviewController.js")

router.post('/postreview', reviewController)

