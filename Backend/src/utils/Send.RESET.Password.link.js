const nodemailer = require("nodemailer");

/**
 * Builds a premium HTML email template for password reset.
 * Uses inline styles for maximum email-client compatibility.
 */
function buildResetEmailHTML(resetUrl, recipientEmail) {
    const year = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Reset Your Password — CaptionGen</title>
</head>
<body style="margin:0; padding:0; background-color:#0a0a0a; font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a; min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Main card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#1a1a1a; border:1px solid rgba(212,175,55,0.3); border-radius:2px;">

          <!-- Gold accent bar -->
          <tr>
            <td style="height:4px; background: linear-gradient(90deg, #d4af37, #f5d76e, #d4af37);"></td>
          </tr>

          <!-- Logo section -->
          <tr>
            <td align="center" style="padding:36px 40px 20px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:40px; height:40px; border:2px solid #d4af37; text-align:center; vertical-align:middle;">
                    <span style="color:#d4af37; font-size:20px; line-height:36px;">⚡</span>
                  </td>
                  <td style="padding-left:12px;">
                    <span style="font-size:20px; font-weight:700; color:#d4af37; letter-spacing:4px; text-transform:uppercase;">CaptionGen</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px; background-color:rgba(212,175,55,0.15);"></div>
            </td>
          </tr>

          <!-- Lock icon + heading -->
          <tr>
            <td align="center" style="padding:32px 40px 8px 40px;">
              <div style="width:64px; height:64px; border-radius:50%; background-color:rgba(212,175,55,0.08); border:1px solid rgba(212,175,55,0.2); text-align:center; line-height:64px; margin-bottom:20px;">
                <span style="font-size:28px;">🔒</span>
              </div>
              <h1 style="margin:0; font-size:22px; font-weight:700; color:#f5f0e8; letter-spacing:2px; text-transform:uppercase;">
                Password Reset
              </h1>
              <p style="margin:8px 0 0 0; font-size:13px; color:#a0977d; letter-spacing:1px; text-transform:uppercase;">
                Secure account recovery
              </p>
            </td>
          </tr>

          <!-- Body content -->
          <tr>
            <td style="padding:24px 40px 0 40px;">
              <p style="margin:0 0 16px 0; font-size:15px; color:#c8c0b0; line-height:1.7;">
                Hello,
              </p>
              <p style="margin:0 0 16px 0; font-size:15px; color:#c8c0b0; line-height:1.7;">
                We received a request to reset the password for your CaptionGen account associated with
                <strong style="color:#d4af37;">${recipientEmail}</strong>.
              </p>
              <p style="margin:0 0 28px 0; font-size:15px; color:#c8c0b0; line-height:1.7;">
                Click the button below to create a new password:
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding:0 40px 28px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" target="_blank"
                       style="display:inline-block; padding:16px 48px; background-color:#d4af37; color:#0a0a0a; font-size:14px; font-weight:700; text-decoration:none; letter-spacing:3px; text-transform:uppercase; border-radius:2px; min-width:200px; text-align:center;">
                      RESET PASSWORD
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fallback link -->
          <tr>
            <td style="padding:0 40px 28px 40px;">
              <div style="background-color:rgba(212,175,55,0.05); border:1px solid rgba(212,175,55,0.12); border-radius:2px; padding:16px;">
                <p style="margin:0 0 8px 0; font-size:11px; color:#a0977d; letter-spacing:1px; text-transform:uppercase;">
                  Button not working? Copy this link:
                </p>
                <p style="margin:0; word-break:break-all;">
                  <a href="${resetUrl}" target="_blank" style="font-size:12px; color:#d4af37; text-decoration:underline;">${resetUrl}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px; background-color:rgba(212,175,55,0.15);"></div>
            </td>
          </tr>

          <!-- Security notice -->
          <tr>
            <td style="padding:24px 40px 8px 40px;">
              <p style="margin:0 0 12px 0; font-size:12px; color:#a0977d; letter-spacing:1px; text-transform:uppercase; font-weight:600;">
                🛡️ Security Information
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 28px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0; border-bottom:1px solid rgba(212,175,55,0.08);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="24" style="color:#d4af37; font-size:14px; vertical-align:top; padding-top:2px;">⏱</td>
                        <td style="font-size:13px; color:#8a8170; line-height:1.5; padding-left:8px;">
                          This link expires in <strong style="color:#c8c0b0;">1 hour</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0; border-bottom:1px solid rgba(212,175,55,0.08);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="24" style="color:#d4af37; font-size:14px; vertical-align:top; padding-top:2px;">🔑</td>
                        <td style="font-size:13px; color:#8a8170; line-height:1.5; padding-left:8px;">
                          This link can only be used <strong style="color:#c8c0b0;">once</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="24" style="color:#d4af37; font-size:14px; vertical-align:top; padding-top:2px;">⚠️</td>
                        <td style="font-size:13px; color:#8a8170; line-height:1.5; padding-left:8px;">
                          If you didn't request this, <strong style="color:#c8c0b0;">ignore this email</strong> — your password won't change
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom gold accent bar -->
          <tr>
            <td style="height:4px; background: linear-gradient(90deg, #d4af37, #f5d76e, #d4af37);"></td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
          <tr>
            <td align="center" style="padding:28px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:28px; height:28px; border:1px solid rgba(212,175,55,0.3); text-align:center; vertical-align:middle;">
                    <span style="color:#d4af37; font-size:13px; line-height:26px;">⚡</span>
                  </td>
                  <td style="padding-left:8px;">
                    <span style="font-size:12px; font-weight:600; color:rgba(212,175,55,0.5); letter-spacing:3px; text-transform:uppercase;">CaptionGen</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:12px 40px;">
              <p style="margin:0; font-size:11px; color:#555; line-height:1.6;">
                AI-Powered Caption Generator
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 8px 40px;">
              <div style="height:1px; width:60px; background-color:rgba(212,175,55,0.2); margin:0 auto;"></div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:8px 40px 40px 40px;">
              <p style="margin:0; font-size:10px; color:#444; line-height:1.6;">
                © ${year} CaptionGen. All rights reserved.<br/>
                This is an automated message — please do not reply.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `.trim();
}

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
        subject: "🔒 Reset Your Password — CaptionGen",
        // Plain-text fallback for email clients that don't render HTML
        text: `Password Reset Request\n\nWe received a request to reset your CaptionGen password.\n\nClick the link below to reset your password:\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.\n\n© ${new Date().getFullYear()} CaptionGen`,
        html: buildResetEmailHTML(resetUrl, to),
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