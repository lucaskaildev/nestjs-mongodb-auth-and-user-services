import * as nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    host: process.env.MAILING_SERVICE_HOST,
    auth: {
        user: process.env.MAILING_SERVICE_USER,
        pass: process.env.MAILING_SERVICE_PASSWORD
    },
    secure: true,
    debug: false,
    logger: false,
    port: parseInt(process.env.MAILING_SERVICE_TRANSPORT_PORT),
    tls: {
        rejectUnauthorized: true
    }
})