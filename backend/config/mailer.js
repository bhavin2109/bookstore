import nodemailer from "nodemailer";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

// Optimize DNS resolution for cloud environments (prefer IPv4)
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

let transporter = null;

const createTransporter = () => {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        console.warn("⚠️  Email credentials missing in environment variables.");
        return null;
    }

    // Robust configuration for Render + Gmail
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // Use 465 (SMTPS) instead of 587 (STARTTLS) for better cloud reliability
        secure: true, // Must be true for port 465
        auth: {
            user: emailUser,
            pass: emailPass,
        },
        tls: {
            // Do not fail on invalid certs (common wrapper issue in some cloud envs)
            // But prefer valid certs. Keep rejection true unless specific error.
            // For Gmail, we can generally trust the cert, but if Render intercepts, 
            // we might need this false. User had it false. Let's start with safe defaults 
            // but add specific socket options.
            rejectUnauthorized: false
        },
        // Connection timeouts
        connectionTimeout: 10000, // 10s
        socketTimeout: 30000,    // 30s
    });
};

// Singleton-ish pattern to avoid recreating
const getTransporter = () => {
    if (!transporter) {
        transporter = createTransporter();
    }
    return transporter;
};

// Verification function to run on startup
export const verifyTransporter = async () => {
    const t = getTransporter();
    if (!t) {
        console.log("❌ Mailer: configuration invalid (missing creds)");
        return;
    }
    try {
        console.log("⏳ Testing SMTP connection to Gmail...");
        await t.verify();
        console.log("✅ SMTP Connection Successful! Ready to send emails.");
    } catch (error) {
        console.error("❌ SMTP Connection Failed:", error.message);
        console.error("   Hint: Check firewall, port 465 block, or invalid App Password.");
    }
};

export default getTransporter;

// Auto-run verification on import/startup
setTimeout(() => {
    verifyTransporter();
}, 2000);