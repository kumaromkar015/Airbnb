const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const reviews = require("./routes/reviews.js");
const listings = require("./routes/listings.js");

const MONG_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
async function main() {
	await mongoose.connect(MONG_URL);
}
main()
	.then(() => {
		console.log(`Connected to DB`);
	})
	.catch((err) => {
		console.error(err);
	});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/listings", listings);
app.use("/listings/:id/review", reviews);

// Home Route
app.get("/", (req, res) => {
	res.send(`Hi , Its AirNb`);
});

// Error handling for 404
app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page not found"));
});

// General error handling middleware
app.use((err, req, res, next) => {
	const { statusCode = 500, message = "Something went wrong" } = err;
	res.status(statusCode).render("./Error.ejs", { err });
	// res.status(statusCode).send(message); // Optional: Use this if you prefer sending plain text
});

// Start server
const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
