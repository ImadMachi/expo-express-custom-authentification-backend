import mongoose from "mongoose";

async function run() {
	await mongoose.connect(process.env.MONGO_URI as string);

	// To run mongodb locally
	// await mongoose.connect("mongodb://localhost:27017/club");
}

export default run;
