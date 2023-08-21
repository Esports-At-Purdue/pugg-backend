import * as express from "express";
import * as mailer from "nodemailer";
export const EmailRouter = express.Router();

EmailRouter.use(express.json());

EmailRouter.post("/", async (request, response) => {
    try {

        const key = request?.header("key");
        const { address, link } = request?.body;

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const transporter = mailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const options = {
            from: process.env.EMAIL_USERNAME,
            to: address,
            subject: "Discord Email Verification",
            html: `
                <h1>PUGG Discord Account Verification</h1>
                <p>Click the link below to verify your account:</p>
                <p><a href="${link}">${link}</a></p>
            `
        };

        await transporter.sendMail(options);
        response.status(200).send()

    } catch (error) {
        response.status(500).send(error);
    }
});