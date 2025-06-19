const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {ListingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req,res,next)=>{
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

//show all listings
router.get("/",wrapAsync(async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//new listing
router.get("/new",isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});
//show listing
router.get("/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "The listing you requested does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

//create listing
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    let { listing } = req.body;
    if (!listing.image || listing.image.trim() === "") {
        listing.image = undefined;
    } else {
        listing.image = {
            filename: "userupload",
            url: listing.image
        };
    }

    const newListing = new Listing(listing);
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
}));


//show route
router.get("/:id/edit",isLoggedIn,wrapAsync( async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
        if(!listing){
        req.flash("error", "The listing you requested does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

//edit listing
router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, price, location, country, image } = req.body.listing;

    let imageObject;

    if (image && image.trim() !== "") {
        imageObject = {
            url: image.trim(),
            filename: "listingimage"
        };
    } else {
        imageObject = undefined; // triggers schema default
    }

    await Listing.findByIdAndUpdate(id, {
        title,
        description,
        price,
        location,
        country,
        image: imageObject
    });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}));


//delete Route
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));

module.exports = router;