import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const testEmail = async () => {
    console.log('📧 Starting Email Test Script');
    console.log('----------------------------');

    const emailUser = process.env.EMAIL_USER?.trim();
    const emailPass = process.env.EMAIL_PASS?.trim();

    console.log(`User: ${emailUser ? emailUser : 'MISSING'}`);
    console.log(`Pass: ${emailPass ? '********' : 'MISSING'}`);

    if (!emailUser || !emailPass) {
        console.error('❌ Missing credentials in .env file');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: emailUser,
            pass: emailPass,
        },
        // Add timeouts
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        logger: true,
        debug: true,
    });

    try {
        console.log('🔄 Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection verified successfully!');

        console.log('📤 Attempting to send test email...');
        await transporter.sendMail({
            from: emailUser,
            to: emailUser, // Send to self
            subject: 'Test Email from Bookstore App',
            text: 'If you see this, your email configuration is working!',
        });
        console.log('✅ Test email sent successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 'EAUTH') {
            console.error('💡 Hint: Check your App Password and ensure 2FA is on.');
        }
    }
};

testEmail();
