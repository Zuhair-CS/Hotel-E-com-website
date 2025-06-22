const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

//show all listings
router.get("/",wrapAsync(listingController.index));
//new listing
router.get("/new",isLoggedIn, listingController.renderNewForm);
//show listing
router.get("/:id", wrapAsync(listingController.showListing));
//create listing
router.post("/", validateListing, wrapAsync(listingController.createListing));
//show route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.renderEditForm));
//edit listing
router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));
//delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));
module.exports = router;