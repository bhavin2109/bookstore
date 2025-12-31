import getTransporter from "../config/mailer.js";

const sendOtpMail = async (req, res, next) => {
    console.log('📧 sendOtpMail middleware started');
    console.log('🔍 req.otpData:', req.otpData);

    let email, otp, type;

    try {
        // Check if otpData exists
        if (!req.otpData) {
            console.error('❌ req.otpData is missing!');
            return res.status(500).json({ message: 'OTP data not found' });
        }

        email = req.otpData.email;
        otp = req.otpData.otp;
        type = req.otpData.type;

        console.log('📬 Preparing to send email to:', email);
        console.log('🔐 OTP to send:', otp);

        const subject = type === "Registration"
            ? "Your OTP for Registration"
            : "Your OTP for Password Reset";

        // Check email configuration
        const emailUser = process.env.EMAIL_USER?.trim();
        const emailPass = process.env.EMAIL_PASS?.trim();

        if (!emailUser || !emailPass) {
            console.error('❌ Email credentials missing!');
            console.error('EMAIL_USER:', emailUser ? 'Set' : 'Missing');
            console.error('EMAIL_PASS:', emailPass ? 'Set' : 'Missing');
            console.log('⚠️  OTP (email not configured):', otp);
            // Allow registration to proceed
            return next();
        }

        console.log('📤 Getting transporter...');
        const transporter = getTransporter();

        console.log('📧 Sending email to:', email);
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

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);

        next();
    }
    catch (error) {
        console.error('❌ Error in sendOtpMail:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);

        if (error.code === 'EAUTH') {
            console.error('👉 Authentication failed. Check EMAIL_USER and EMAIL_PASS');
            console.error('👉 For Gmail, use App Password (not regular password)');
            console.error('👉 Enable 2-Step Verification on Google account');
        }

        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
            console.error('👉 Connection timeout. Check network/firewall settings');
        }

        // CRITICAL FIX: Log OTP and allow registration to proceed
        console.log('⚠️  EMAIL FAILED - OTP for user:', otp);
        console.log('⚠️  User can check server logs for OTP or contact support');

        // Allow registration to proceed even if email fails
        console.log('✅ Allowing registration to proceed despite email failure - Check Server Logs for OTP');
        next();
    }
}

export default sendOtpMail;