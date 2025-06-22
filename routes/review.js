const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js"); 
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isCreator} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//post review route
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));
//delete review route
router.delete("/:reviewID",isCreator, wrapAsync(reviewController.destroyReview));

module.exports = router;