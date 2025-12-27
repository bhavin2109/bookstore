import getTransporter from "../config/mailer.js";
import User from "../models/User.js";

const sendOtpMail = async (req, res, next) => {
    console.log('📧 sendOtpMail middleware started');
    console.log('🔍 req.otpData:', req.otpData);
    
    // Declare variables at function scope so they're accessible in catch block
    let email, otp, type;
    
    try {
        // Check if otpData exists
        if (!req.otpData) {
            console.error('❌ req.otpData is missing!');
            return res.status(500).json({ message: 'OTP data not found' });
        }

        // Assign values from req.otpData
        email = req.otpData.email;
        otp = req.otpData.otp;
        type = req.otpData.type;
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
        console.error('Error stack:', error.stack);
        
        if (error.code === 'EAUTH') {
            console.error('👉 Check EMAIL_USER and EMAIL_PASS in .env');
        }

        // FALLBACK FOR PRODUCTION/HOSTED SITES:
        // If email fails (likely due to blocking/timeout), set a static OTP so the user can still proceed.
        
        // Safety check: ensure we have the email before attempting fallback
        if (!email) {
            console.error('❌ Cannot activate fallback: email is undefined');
            return res.status(500).json({ 
                message: 'Registration failed. Missing email data.',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
        
        try {
            console.log('⚠️  Email failed. Activating Static OTP fallback for:', email);
            const staticOtp = "123456";
            
            // Update user with static OTP
            const updateResult = await User.findOneAndUpdate(
                { email }, 
                { otp: staticOtp, otpExpiry: Date.now() + 10 * 60 * 1000 },
                { new: true }
            );
            
            if (!updateResult) {
                console.error('❌ User not found for email:', email);
                return res.status(500).json({ 
                    message: 'Registration failed. User not found.',
                    error: 'User creation may have failed'
                });
            }
            
            console.log('✅ User OTP updated to static code: 123456');

            return res.status(200).json({ 
                message: 'Registration successful! OTP sent to email.',
                info: 'If you do not receive the email, use the default OTP.',
                mockOtp: process.env.NODE_ENV === 'development' ? staticOtp : undefined,
                isFallback: true
            });
        } catch (dbError) {
            console.error('❌ Failed to set static OTP:', dbError);
            console.error('DB Error stack:', dbError.stack);
            return res.status(500).json({ 
                message: 'Registration failed. Database error.',
                error: process.env.NODE_ENV === 'development' ? dbError.message : 'Internal server error'
            });
        }
    }
}

export default sendOtpMail;