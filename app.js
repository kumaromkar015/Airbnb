if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");

//Routes
const reviewRoutes = require("./routes/reviews.js");
const listingRoutes = require("./routes/listings.js");
const userRoutes = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
	mongoUrl: dbUrl,
	crypto: {
		secret: process.env.SECRET,
	},
	touchAfter: 24 * 3600,
});

store.on("error", (err) => {
	console.log("ERROR in MONGO SESSION STORE ", err);
});

//session varibles
const sessionOptions = {
	store,
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	},
};

// Connect to MongoDB
async function main() {
	await mongoose.connect(dbUrl);
}
main()
	.then(() => {
		console.log(`Connected to DB`);
	})
	.catch((err) => {
		console.error(err);
	});

// Middleware
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//locals
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currUser = req.user;
	next();
});

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/review", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
	res.redirect("/listings");
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
