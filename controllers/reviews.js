const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
	console.log(req.params.id);
	let listings = await Listing.findById(req.params.id);
	let newReview = new Review(req.body.reviews);
	newReview.author = req.user._id;
	console.log(newReview);
	listings.reviews.push(newReview);
	await newReview.save();
	await listings.save();
	req.flash("success", " Review Created");
	res.redirect(`/listings/${listings.id}`);
};

module.exports.destroyReview = async (req, res) => {
	let { id, reviewId } = req.params;
	await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	req.flash("success", "Reviews Deleted");
	res.redirect(`/listings/${id}`);
};
