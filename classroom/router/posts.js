const express = require("express");
const router = express.Router();

//posts

router.get("/", (req, res) => {
	res.send("index route for posts");
});

router.get("/:id", (req, res) => {
	res.send("index route for posts id");
});

router.post("/", (req, res) => {
	res.send("index route for posts post");
});

router.delete("/:id", (req, res) => {
	res.send("index route for posts delete");
});

module.exports = router;
