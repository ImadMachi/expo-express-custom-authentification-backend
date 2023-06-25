import transporter from "../config/nodemailer";

export async function sendVerificationEmail(email: string, verificationLink: string) {
	const mailOptions = {
		from: "club.IA2I@gmail.com",
		to: email,
		subject: "Verify your email",
		html: `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`,
	};
	await transporter.sendMail(mailOptions);
}
