import getTransporter from "../config/mailer.js";

const sendOtpMail = async (req, res, next) => {
  try {
    if (!req.otpData) {
      return res.status(500).json({
        message: "OTP generation failed",
      });
    }

    const { email, otp, type } = req.otpData;

    const subject =
      type === "Registration"
        ? "Your OTP for Registration"
        : "Your OTP for Password Reset";

    const emailUser = process.env.EMAIL_USER;

    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"Bookstore" <${emailUser}>`,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your OTP Code</h2>
          <p>Your OTP for <b>${type}</b> is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    console.log(`✅ OTP email sent successfully to ${email}`);

    // ✅ ONLY proceed if email was sent
    return next();

  } catch (error) {
    console.error("❌ SMTP FAILURE:", {
      code: error.code,
      message: error.message,
    });

    // ✅ Honest, controlled failure
    return res.status(503).json({
      message: "Email service temporarily unavailable. Please try again.",
      error: "SMTP_DELIVERY_FAILED",
    });
  }
};

export default sendOtpMail;
