import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async (receiverEmail, subject, body) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: receiverEmail,
            subject: subject,
            html: body
        });
        console.log("Email sent to", receiverEmail);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};
