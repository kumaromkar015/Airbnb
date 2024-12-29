const express = require("express");
const app = express();
const users = require("./router/users.js");
const posts = require("./router/posts.js");
const cookieParser = require("cookie-parser");

app.listen(3000, () => {
	console.log("server is liestning on 3000");
});
app.use(cookieParser("secretcode"));

app.get("/getsignedcookie", (req, res) => {
	res.cookie("made-In", "India", { signed: true });
	res.send("cookies sent");
});

app.get("/verify", (req, res) => {
	console.log(req.signedCookies);
	res.send("verified");
});

app.use("/users", users);
app.use("/posts", posts);
