import getTransporter from "../config/mailer.js";

const sendOtpMail = async (req, res, next) => {
    // console.log('📧 sendOtpMail middleware started');

    try {
        if (!req.otpData) {
            console.error('❌ req.otpData is missing!');
            return res.status(500).json({ message: 'Internal Error: OTP data not generated' });
        }

        const { email, otp, type } = req.otpData;
        const subject = type === "Registration" ? "Your OTP for Registration" : "Your OTP for Password Reset";

        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (!emailUser || !emailPass) {
            console.error('❌ Email credentials missing inside middleware');
            return res.status(503).json({
                message: "Email service not configured",
                error: "Server missing email credentials"
            });
        }

        const transporter = getTransporter();
        if (!transporter) {
            return res.status(503).json({ message: "Email service unavailable" });
        }

        // console.log(`📤 Sending ${type} OTP to: ${email}`);

        const info = await transporter.sendMail({
            from: `"Bookstore" <${emailUser}>`,
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Your OTP Code</h2>
                        <p style="font-size: 16px; color: #666; margin-bottom: 20px;">Your OTP for ${type} is:</p>
                        <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                            <p style="font-size: 36px; font-weight: bold; color: #007bff; margin: 0; letter-spacing: 5px;">${otp}</p>
                        </div>
                        <p style="color: #666; font-size: 14px; margin-top: 20px;">This OTP is valid for 10 minutes.</p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                            If you didn't request this, please ignore this email.
                        </p>
                    </div>
                </div>
            `,
        });

        console.log('---------------------------------------------------');
        console.log(`🚀 [PRODUCTION LOG] OTP Email successfully sent to: ${email}`);
        console.log('---------------------------------------------------');

        next(); // Proceed only on success
    }
    catch (error) {
        console.error('❌ FATAL SMTP ERROR:', error.message);

        // Return error to client, stopping the chain
        return res.status(502).json({
            message: "Failed to send verification email",
            error: error.message,
            reason: "SMTP_DELIVERY_FAILED"
        });
    }
}

export default sendOtpMail;
