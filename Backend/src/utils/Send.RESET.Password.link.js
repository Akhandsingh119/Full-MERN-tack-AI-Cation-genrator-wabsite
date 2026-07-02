const nodemailer = require("nodemailer");

async function sendResetEmail(to, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Use SMTP_FROM (your verified sender email on Brevo) for the "from" field.
    // SMTP_USER is the login credential — Brevo will reject it as a sender address.
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

    console.log("[Email] Attempting to send reset email...");
    console.log("[Email] To:", to);
    console.log("[Email] From:", fromEmail);
    console.log("[Email] SMTP Host:", process.env.SMTP_HOST);
    console.log("[Email] SMTP Port:", process.env.SMTP_PORT);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const message = {
        from: `"CaptionGen" <${fromEmail}>`,
        to,
        subject: "Reset Your Password",
        html: `
          <h3>Password Reset Request 🔒</h3>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" target="_blank">Reset Password</a>
          <p>This link expires in 1 hour.</p>
        `,
    };

    try {
        const info = await transporter.sendMail(message);
        console.log("[Email] Sent successfully! Message ID:", info.messageId);
        console.log("[Email] Response:", info.response);
        return info;
    } catch (err) {
        console.error("[Email] Failed to send!");
        console.error("[Email] Error code:", err.code);
        console.error("[Email] Error message:", err.message);
        console.error("[Email] Full error:", err);
        throw err;
    }
}


module.exports = sendResetEmail;