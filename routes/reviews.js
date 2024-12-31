const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validateReview } = require("../middleware.js");

// reviews route
router.post(
	"/",
	validateReview,
	wrapAsync(async (req, res) => {
		console.log(req.params.id);
		let listings = await Listing.findById(req.params.id);
		let newReview = new Review(req.body.reviews);

		listings.reviews.push(newReview);
		await newReview.save();
		await listings.save();
		req.flash("success", " Review Created");
		res.redirect(`/listings/${listings.id}`);
	})
);

// delete review
router.delete(
	"/:reviewId",
	wrapAsync(async (req, res) => {
		let { id, reviewId } = req.params;
		await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash("success", "Reviews Deleted");
		res.redirect(`/listings/${id}`);
	})
);

module.exports = router;
