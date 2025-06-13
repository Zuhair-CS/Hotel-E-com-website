const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {ListingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

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
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
});
//show listing
router.get("/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

//create listing
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    let { listing } = req.body;

    // Check if image is empty string
    if (!listing.image || listing.image.trim() === "") {
        listing.image = undefined; // Let schema use default
    } else {
        listing.image = {
            filename: "userupload",
            url: listing.image
        };
    }

    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
}));


//show route
router.get("/:id/edit",wrapAsync( async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//edit listing
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
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

    res.redirect(`/listings/${id}`);
}));


//delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    console.log("going to delete");
    await Listing.findByIdAndDelete(id);
    console.log("deleted");
    res.redirect("/listings");
}));

module.exports = router;