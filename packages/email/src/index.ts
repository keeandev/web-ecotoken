import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_VERIFICATION_EMAIL_ADDRESS,
        serviceClient: process.env.EMAIL_CLIENT_ID,
        privateKey: process.env.EMAIL_PRIVATE_KEY,
    },
});
