import transporter from "../config/nodemailer";

class MailerService {
	async sendVerificationEmail(email: string, verificationCode: string) {
		const mailOptions = {
			from: "club.IA2I@gmail.com",
			to: email,
			subject: "Verification code",
			html: `Your verification code: ${verificationCode}`,
		};
		await transporter.sendMail(mailOptions);
	}
}

export default new MailerService();
