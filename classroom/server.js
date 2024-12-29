const express = require("express");
const app = express();
const users = require("./router/users.js");
const posts = require("./router/posts.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

//session varibles
const sessionOptions = {
	secret: "mysupersecretstring",
	resave: false,
	saveUninitialized: true,
};

//liesting port
app.listen(3000, () => {
	console.log("server is liestning on 3000");
});

//middleware
app.use(session(sessionOptions));
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
	res.locals.successMsg = req.flash("success");
	res.locals.errorMsg = req.flash("error");
	next();
});

// Routes
app.get("/register", (req, res) => {
	let { name = "anomoyous" } = req.query;
	req.session.name = name;

	if (name === "anomoyous") {
		req.flash("error", "user not registered ");
	} else {
		req.flash("success", "user register successfully");
	}
	res.redirect("/hello");
});

app.get("/hello", (req, res) => {
	res.render("page.ejs", { name: req.session.name });
});
