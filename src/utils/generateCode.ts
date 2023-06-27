import crypto from "crypto";

export default function generateCode(length: number = 5) {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let randomString = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = crypto.randomInt(0, characters.length);
		randomString += characters.charAt(randomIndex);
	}

	return randomString;
}
