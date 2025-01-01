const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {
	validateReview,
	isLoggedIn,
	isReviewAuthor,
} = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");

// reviews route
router.post(
	"/",
	isLoggedIn,
	validateReview,
	wrapAsync(ReviewController.createReview)
);

// delete review
router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	wrapAsync(ReviewController.destroyReview)
);

module.exports = router;
