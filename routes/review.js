const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js"); 
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isCreator} = require("../middleware.js");

//post review route
router.post("/", isLoggedIn,validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.createdBy = req.user._id;
    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success", "Review Added");
    res.redirect(`/listings/${id}`);
}));
//delete review route
router.delete("/:reviewID",isCreator, wrapAsync(async (req, res) => {
    let {id, reviewID} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
        req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`)
}));

module.exports = router;