const Listing = require("../models/listing.js");

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate: {path:"createdBy"}}).populate("owner");
    if(!listing){
        req.flash("error", "The listing you requested does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next) => {
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
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
        if(!listing){
        req.flash("error", "The listing you requested does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req, res) => {
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
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}