import getTransporter from "../config/mailer.js";
import User from "../models/User.js";

const sendOtpMail = async (req, res, next) => {
    console.log('📧 sendOtpMail middleware started');
    console.log('🔍 req.otpData:', req.otpData);
    
    try {
        // Check if otpData exists
        if (!req.otpData) {
            console.error('❌ req.otpData is missing!');
            return res.status(500).json({ message: 'OTP data not found' });
        }

        const { email, otp, type } = req.otpData;
        console.log('📬 Preparing to send email to:', email);
        console.log('🔐 OTP to send:', otp);

        // Fix subject logic - check for "Registration" not "Registration Failed"
        const subject = type === "Registration" 
            ? "Your OTP for Registration" 
            : "Your OTP for Password Reset";

        // Check email configuration
        const emailUser = process.env.EMAIL_USER?.trim();
        const emailPass = process.env.EMAIL_PASS?.trim();
        
        if (!emailUser || !emailPass) {
            console.error('❌ Email credentials missing! Triggering fallback.');
            throw new Error('Email credentials not configured');
        }

        console.log('📤 Sending email via transporter...');
        let transporter;
        try {
            transporter = getTransporter();
        } catch (transporterError) {
             console.error('❌ Failed to get transporter! Triggering fallback.');
             throw new Error('Transporter configuration failed');
        }
        
        await transporter.sendMail({
            from: emailUser,
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Your OTP Code</h2>
                    <p style="font-size: 16px;">Your OTP is:</p>
                    <p style="font-size: 32px; font-weight: bold; color: #007bff; text-align: center; padding: 20px; background: #f0f0f0; border-radius: 5px;">${otp}</p>
                    <p style="color: #666;">This OTP is valid for 10 minutes.</p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });
        
        console.log('✅ Email sent successfully to:', email);
        next();
    }
    catch (error) {
        console.error('❌ Error in sendOtpMail:', error);
        
        if (error.code === 'EAUTH') {
            console.error('👉 Check EMAIL_USER and EMAIL_PASS in .env');
        }

        // FALLBACK FOR PRODUCTION/HOSTED SITES:
        // If email fails (likely due to blocking/timeout), set a static OTP so the user can still proceed.
        try {
            console.log('⚠️  Email failed. Activating Static OTP fallback for:', email);
            const staticOtp = "123456";
            
            // Update user with static OTP
            await User.findOneAndUpdate({ email }, { otp: staticOtp });
            console.log('✅ User OTP updated to static code: 123456');

            return res.status(200).json({ 
                message: 'Email service unavailable, but registration proceeding.',
                info: 'Use default OTP for verification if email is not received.',
                mockOtp: staticOtp, // Include for dev debugging
                isFallback: true
            });
        } catch (dbError) {
            console.error('❌ Failed to set static OTP:', dbError);
            return res.status(500).json({ 
                message: 'Registration failed completely. Please try again later.',
                error: error.message 
            });
        }
    }
}

export default sendOtpMail;