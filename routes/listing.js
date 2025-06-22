const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

router.route("/")
.get(wrapAsync(listingController.index)) //show all listings
.post( validateListing, wrapAsync(listingController.createListing)); //create listing

//new listing
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))//show listing
.put(isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing)) //edit listing
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing)); //delete Route

//show route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.renderEditForm));

module.exports = router;