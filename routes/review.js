const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/review.js"); 
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

const validateReview = (req,res,next)=>{ 
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//post review route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success", "Review Added");
    res.redirect(`/listings/${id}`);
}));
//delete review route
router.delete("/:reviewID", wrapAsync(async (req, res) => {
    let {id, reviewID} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
        req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`)
}));

module.exports = router;