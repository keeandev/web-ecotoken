import nodemailer from "nodemailer";
import key from "../../../key.json";

export const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		type: "OAuth2",
		user: process.env.EMAIL_VERIFICATION_EMAIL_ADDRESS,
		serviceClient: key.client_id,
		privateKey: key.private_key
	}
});
