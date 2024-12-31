const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body);

	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

// index route
router.get(
	"/",
	wrapAsync(async (req, res) => {
		const allListings = await Listing.find({});

		res.render("listings/index.ejs", { allListings });
	})
);

// New Route
router.get("/new", isLoggedIn, (req, res) => {
	res.render("listings/new.ejs");
});

// show Route

router.get(
	"/:id",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listing = await Listing.findById(id).populate("reviews");
		if (!listing) {
			req.flash("error", "Listing you requested for does not exits!");
			res.redirect("/listings");
		}
		res.render("listings/show.ejs", { listing });
	})
);

//create route
router.post(
	"/",
	isLoggedIn,
	validateListing,
	wrapAsync(async (req, res, next) => {
		const newListing = new Listing(req.body.listing);

		await newListing.save();
		req.flash("success", "New Listing Created");
		res.redirect("/listings");
	})
);

// edit route
router.get(
	"/:id/edit",
	isLoggedIn,
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listing = await Listing.findById(id);
		if (!listing) {
			req.flash("error", "Listing you requested for does not exits!");
			res.redirect("/listings");
		}
		res.render("listings/edit.ejs", { listing });
	})
);
// update route

router.put(
	"/:id",
	isLoggedIn,
	validateListing,
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		await Listing.findByIdAndUpdate(id, { ...req.body.listing });
		res.redirect(`/listings/${id}`);
	})
);

// DELETE ROUTE

router.delete(
	"/:id",
	isLoggedIn,
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		console.log(req.params);
		let deletedListing = await Listing.findByIdAndDelete(id);
		console.log(deletedListing);
		req.flash("success", " Listing Deleted");
		res.redirect(`/listings`);
	})
);

module.exports = router;
