import nodemailer from "nodemailer";
import key from "../../key.json";

export const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		type: "OAuth2",
		user: "support@eco-token.io",
		serviceClient: key.client_id,
		privateKey: key.private_key
	}
});
