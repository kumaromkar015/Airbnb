const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/reviews.js");

app.listen(1234, () => {
	console.log(`PORT is Listeing  1234`);
});

const MONG_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
	await mongoose.connect(MONG_URL);
}
main()
	.then(() => {
		console.log(`Connected to DB`);
	})
	.catch((err) => {
		console.log(err);
	});

app.get("/", (req, res) => {
	res.send(`Hi , Its AirNb`);
});

const validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body);

	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};
const validateReview = (req, res, next) => {
	let { error } = reviewSchema.validate(req.body);

	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get(
	"/testListing",

	wrapAsync(async (req, res) => {
		let sampleListing = new Listing({
			title: " My New Villa",
			description: "By The Beach",
			price: 1200,
			location: "calanguate, Goa",
			country: "India",
		});
		await sampleListing.save();
		console.log(`sample was saved`);
		res.send("successful");
	})
);
// index route
app.get(
	"/listings",
	wrapAsync(async (req, res) => {
		const allListings = await Listing.find({});

		res.render("listings/index.ejs", { allListings });
	})
);

// New Route
app.get("/listings/new", (req, res) => {
	res.render("listings/new.ejs");
});

// show Route

app.get(
	"/listings/:id",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listing = await Listing.findById(id).populate("reviews");
		res.render("listings/show.ejs", { listing });
	})
);

//create route
app.post(
	"/listings",
	validateListing,
	wrapAsync(async (req, res, next) => {
		const newListing = new Listing(req.body.listing);

		await newListing.save();
		res.redirect("/listings");
	})
);

// edit route
app.get(
	"/listings/:id/edit",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listing = await Listing.findById(id);
		res.render("listings/edit.ejs", { listing });
	})
);
// update route

app.put(
	"/listings/:id",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		await Listing.findByIdAndUpdate(id, { ...req.body.listing });
		res.redirect(`/listings/${id}`);
	})
);

// DELETE ROUTE
app.delete(
	"/listings/:id",
	wrapAsync(async (req, res) => {
		let { id } = req.params;
		let deletedListing = await Listing.findByIdAndDelete(id);
		console.log(deletedListing);
		res.redirect("/listings");
	})
);

// reviews route
app.post(
	"/listings/:id/review",
	validateReview,
	wrapAsync(async (req, res) => {
		let listings = await Listing.findById(req.params.id);
		let newReview = new Review(req.body.reviews);

		await listings.reviews.push(newReview);
		await newReview.save();
		await listings.save();

		res.redirect(`/listings/${listings.id}`);
	})
);

// delete review
app.delete(
	"/listings/:id/review/:reviewId",
	wrapAsync(async (req, res) => {
		let { id, reviewId } = req.params;
		await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);

		res.redirect(`/listings/${id}`);
	})
);
//middleware

app.all("*", (req, res, next) => {
	next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
	let { statusCode = 500, message = "something went wrong " } = err;
	res.status(statusCode).render("./Error.ejs", { err });
	// res.status(statusCode).send(message);
});
