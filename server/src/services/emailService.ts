import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
  // For Gmail
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password, not regular password
      },
    });
  }

  // For other email services (like Outlook, Yahoo, etc.)
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Default to Gmail
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetUrl: string
): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Algorithm Visualizer" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request - Algorithm Visualizer",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%);
              color: #ffffff;
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color: #06b6d4;
              font-size: 22px;
              margin-top: 0;
            }
            .content p {
              font-size: 16px;
              color: #555;
              margin: 15px 0;
            }
            .button-container {
              text-align: center;
              margin: 35px 0;
            }
            .button {
              display: inline-block;
              padding: 15px 40px;
              background: linear-gradient(to right, #06b6d4, #22d3ee);
              color: #000000;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
            }
            .button:hover {
              background: linear-gradient(to right, #0891b2, #06b6d4);
            }
            .link-box {
              background-color: #f0f9ff;
              border: 1px solid #bae6fd;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              word-break: break-all;
            }
            .link-box p {
              margin: 5px 0;
              font-size: 14px;
              color: #0c4a6e;
            }
            .link-box a {
              color: #0891b2;
              text-decoration: none;
            }
            .footer {
              background-color: #f8fafc;
              padding: 25px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .footer p {
              margin: 5px 0;
              font-size: 14px;
              color: #64748b;
            }
            .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .warning p {
              margin: 0;
              font-size: 14px;
              color: #92400e;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
            </div>
            
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <p>We received a request to reset your password for your Algorithm Visualizer account.</p>
              
              <p>Click the button below to reset your password:</p>
              
              <div class="button-container">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <div class="link-box">
                <p><strong>Or copy and paste this link:</strong></p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
              </div>
              
              <div class="warning">
                <p><strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.</p>
              </div>
              
              <p style="margin-top: 30px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <div class="footer">
              <p><strong>Algorithm Visualizer</strong></p>
              <p>Making DSA learning visual and intuitive</p>
              <p style="margin-top: 15px; color: #94a3b8;">This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    // Plain text version for email clients that don't support HTML
    text: `
Hello ${name}!

We received a request to reset your password for your Algorithm Visualizer account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

---
Algorithm Visualizer
Making DSA learning visual and intuitive
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email service is ready");
    return true;
  } catch (error) {
    console.error("❌ Email service error:", error);
    return false;
  }
};