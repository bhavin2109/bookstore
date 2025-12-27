import nodemailer from 'nodemailer';

const getTransporter = () => {
    // Check if credentials are valid
    const emailUser = process.env.EMAIL_USER?.trim();
    const emailPass = process.env.EMAIL_PASS?.trim();
    
    // Warn but don't throw immediately, let the caller handle it
    if (!emailUser || !emailPass) {
        console.error('❌ Mailer Error: EMAIL_USER or EMAIL_PASS missing in .env');
        throw new Error('Email credentials not configured');
    }

    // Always create fresh transporter to ensure latest config
    return nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: emailUser,
            pass: emailPass,
        },
        // Increased timeouts for slower connections
        connectionTimeout: 20000, // 20 seconds
        greetingTimeout: 20000,   // 20 seconds
        socketTimeout: 30000,     // 30 seconds
    });
};

// Verify transporter configuration (only if credentials are available)
const verifyTransporter = async () => {
    try {
        const emailUser = process.env.EMAIL_USER?.trim();
        const emailPass = process.env.EMAIL_PASS?.trim();
        
        if (!emailUser || !emailPass) {
            console.warn('⚠️  Email credentials not configured. Email functionality will not work.');
            console.warn('   Please set EMAIL_USER and EMAIL_PASS in your .env file');
            return;
        }

        const transport = getTransporter();
        await transport.verify();
        console.log('✅ Email transporter is ready to send emails');
    } catch (error) {
        console.error('❌ Email transporter verification failed:', error.message);
        if (error.code === 'EAUTH') {
            console.error('   This usually means:');
            console.error('   1. Wrong email or password');
            console.error('   2. For Gmail, you need to use an App Password (not your regular password)');
            console.error('   3. 2-Step Verification must be enabled on your Google account');
        }
    }
};

// Verification is optional and shouldn't block startup
// setTimeout(() => {
//     verifyTransporter();
// }, 1000);

// Export function to get transporter
export default getTransporter;