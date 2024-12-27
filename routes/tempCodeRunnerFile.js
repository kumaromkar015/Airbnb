const express = require("express");
const router = express();
const Listing = require("../models/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");

router.delete(
	"/:id",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		console.log(req.params);
		let deletedListing = await Listing.findByIdAndDelete(id);
		console.log(deletedListing);
		res.redirect(`/listings`);
	})
);