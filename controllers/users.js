const user = require("../models/user.js");

module.exports.rendersignupForm = async (req, res) => {
	try {
		let { username, email, password } = req.body;
		const newUser = new user({ email, username });

		const registeredUser = await user.register(newUser, password);
		console.log(registeredUser);
		req.login(registeredUser, (err) => {
			if (err) {
				return next(err);
			}
			req.flash("success", "welocome to wanderlust ");
			res.redirect("/listings");
		});
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("/signup");
	}
};

module.exports.renderLoginForm = async (req, res) => {
	req.flash("success", "Welcome back to wanderlust! ");
	let redirectUrl = res.locals.redirectUrl || "/listings";
	res.redirect(redirectUrl);
};

module.exports.renderLogoutForm = (req, res) => {
	req.logOut((err) => {
		if (err) {
			return next(err);
		}
		req.flash("success", "you are logged out ");
		res.redirect("/listings");
	});
};
