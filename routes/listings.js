const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// index route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// show Route
router.get("/:id", wrapAsync(listingController.showListing));

//create route
router.post(
	"/",
	isLoggedIn,
	validateListing,
	wrapAsync(listingController.createListings)
);

// edit route
router.get(
	"/:id/edit",
	isLoggedIn,
	isOwner,
	wrapAsync(listingController.renderEditForm)
);
// update route

router.put(
	"/:id",
	isLoggedIn,
	isOwner,
	validateListing,
	wrapAsync(listingController.updateListing)
);

// DELETE ROUTE

router.delete(
	"/:id",
	isLoggedIn,
	isOwner,
	wrapAsync(listingController.destroyListing)
);

module.exports = router;
