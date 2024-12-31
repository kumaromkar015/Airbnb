const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

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

const initDB = async () => {
	await Listing.deleteMany({});
	initData.data = initData.data.map((obj) => ({
		...obj,
		owner: "6772b1710a4601a3ff52eb3a",
	}));
	await Listing.insertMany(initData.data);
	console.log("data was initialize");
};

initDB();
