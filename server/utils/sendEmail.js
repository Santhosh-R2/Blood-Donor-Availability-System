const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // 1. Create Transporter (Configure with your email provider)
    // For Gmail, you might need an "App Password" if 2FA is on.
    const transporter = nodemailer.createTransport({
        service: "gmail", // or your SMTP host
        auth: {
            user: process.env.EMAIL_USER, // e.g., your-email@gmail.com
            pass: process.env.EMAIL_PASS, // e.g., your-app-password
        },
    });

    // 2. Professional HTML Template
    const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #d32f2f; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">BloodLink</h1>
            </div>
            <div style="padding: 30px; background-color: #ffffff;">
                <h2 style="color: #333333; margin-top: 0;">Password Reset Request</h2>
                <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                    Hello,
                </p>
                <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                    We received a request to reset your password. Please use the One-Time Password (OTP) below to proceed.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; color: #d32f2f; letter-spacing: 5px; background-color: #ffebee; padding: 10px 20px; border-radius: 5px;">
                        ${options.otp}
                    </span>
                </div>
                <p style="color: #666666; font-size: 14px; line-height: 1.5;">
                    This OTP is valid for <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email.
                </p>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999999;">
                &copy; ${new Date().getFullYear()} BloodLink. All rights reserved.
            </div>
        </div>
    `;

    // 3. Send Email
    const mailOptions = {
        from: `"BloodLink Support" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;