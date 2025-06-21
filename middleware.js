const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {ListingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!res.locals.currUser || !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You dont have permission to perform that action.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    if (req.body.listing.price) {
        req.body.listing.price = Number(req.body.listing.price);
    }
    let {error} = ListingSchema.validate(req.body.listing);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{ 
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}


module.exports.isCreator = async (req, res, next)=>{
    let {id, reviewID} = req.params;
    let review = await Review.findById(reviewID );
    if (!review || !review.createdBy.equals(res.locals.currUser._id)){
        req.flash("error", "You did not create this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}