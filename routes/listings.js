const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
	.route("/")
	.get(wrapAsync(listingController.index))
	.post(
		isLoggedIn,
		upload.single("listing[image]"),
		validateListing,
		wrapAsync(listingController.createListings)
	);

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
	.route("/:id")
	.get(wrapAsync(listingController.showListing)) // show routes
	.put(
		//update route
		isLoggedIn,
		isOwner,
		upload.single("listing[image]"),
		validateListing,
		wrapAsync(listingController.updateListing)
	)
	.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); //delete route

// edit route
router.get(
	"/:id/edit",
	isLoggedIn,
	isOwner,
	wrapAsync(listingController.renderEditForm)
);

module.exports = router;
