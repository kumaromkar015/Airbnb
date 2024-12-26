const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/reviews.js");
const reviews = require("./routes/reviews.js");
const listings = require("./routes/listings.js");

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

app.use("/listings", listings);
app.use("/listings/:id/review", reviews);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//middleware

app.all("*", (req, res, next) => {
	next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
	let { statusCode = 500, message = "something went wrong " } = err;
	res.status(statusCode).render("./Error.ejs", { err });
	// res.status(statusCode).send(message);
});
