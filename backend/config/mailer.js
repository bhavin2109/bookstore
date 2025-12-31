import nodemailer from "nodemailer";
import dns from "dns";

// 🔑 Force IPv4 (Render + Gmail issue fix)
dns.setDefaultResultOrder("ipv4first");

let cachedTransporter = null;

const createTransporter = (config) => {
  return nodemailer.createTransport({
    ...config,
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000,
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
  });
};

const getTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error("EMAIL_USER or EMAIL_PASS missing");
  }

  if (cachedTransporter) {
    return cachedTransporter;
  }

  // 🔁 Try port 465 first (more reliable on cloud)
  try {
    cachedTransporter = createTransporter({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
    return cachedTransporter;
  } catch (err) {
    console.warn("⚠️ Port 465 failed, falling back to 587");
  }

  // 🔁 Fallback to 587
  cachedTransporter = createTransporter({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  return cachedTransporter;
};

export default getTransporter;
