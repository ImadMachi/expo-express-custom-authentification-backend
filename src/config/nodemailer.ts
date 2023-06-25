import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
	host: "localhost",
	port: 1025,
	secure: false,
	tls: {
		rejectUnauthorized: false,
	},
});

export default transporter;
