const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
	.route("/signup")
	.get((req, res) => {
		res.render("users/signup.ejs");
	})
	.post(wrapAsync(userController.rendersignupForm));

router
	.route("/login")
	.get((req, res) => {
		res.render("users/login.ejs");
	})
	.post(
		saveRedirectUrl,
		passport.authenticate("local", {
			failureRedirect: "/login",
			failureFlash: true,
		}),
		userController.renderLoginForm
	);

router.get("/logout", userController.renderLogoutForm);

module.exports = router;
