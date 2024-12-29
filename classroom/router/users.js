const express = require("express");
const router = express.Router();

//user

router.get("/", (req, res) => {
	res.send("index route for users");
});

router.get("/:id", (req, res) => {
	res.send("index route for user id");
});

router.post("/", (req, res) => {
	res.send("index route for users posts");
});

router.delete("/:id", (req, res) => {
	res.send("index route for users delete");
});

module.exports = router;
