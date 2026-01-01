import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    jwtSecret,
    {
      expiresIn: "7d",
    }
  );
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const register = async (req, res, next) => {
  try {
    console.log('📝 Register function started');
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log('📧 Registering user:', email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists and is verified, reject
      if (existingUser.isVerified) {
        console.log('❌ User already exists and verified');
        return res.status(400).json({
          message: "User already exists and verified",
          isVerified: true
        });
      }

      // If user exists but NOT verified, delete old record and allow re-registration
      console.log('🔄 Unverified user found, deleting old record...');
      await User.deleteOne({ email });
      console.log('✅ Old unverified user deleted');
    }

    const otp = generateOtp();
    console.log('🔐 Generated OTP:', otp);
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('💾 Creating user in database...');
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
      isVerified: false,
    });
    console.log('✅ User created successfully:', newUser._id);

    req.otpData = { email, otp, type: "Registration" };
    console.log('📤 Setting req.otpData and calling next()');

    // Generate token for auto-login
    const token = generateToken(newUser);

    // Attach token/user to request for the response handler
    req.authData = {
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified
      }
    };

    next(); // This should trigger sendOtpMail
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    console.log('🔍 Verify OTP function started');
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    console.log('🔐 Verifying OTP for:', email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      console.log('❌ User already verified');
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp) {
      console.log('❌ Invalid OTP provided');
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      console.log('❌ OTP expired');
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Update user as verified
    console.log('✅ OTP verified, updating user...');
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token
    console.log('🔑 Generating JWT token...');
    const token = generateToken(user);
    console.log('✅ Token generated successfully');

    // Return token in response
    res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    req.otpData = { email, otp, type: "Registration" };
    next();

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete user by email (for testing purposes)
export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await User.deleteOne({ email });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login function
export const login = async (req, res) => {
  try {
    console.log('🔐 Login function started');
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.log('📧 Login attempt for:', email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user is verified
    // if (!user.isVerified) {
    //   console.log('❌ User not verified');
    //   return res.status(401).json({ message: "Please verify your email first" });
    // }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    console.log('🔑 Generating JWT token...');
    const token = generateToken(user);
    console.log('✅ Login successful');

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const googleAuthLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
      // If user exists, update/link info if needed
      if (user.authProvider === "local") {
        // Optional: you could merge accounts or just allow login
        // For now, we update the avatar if missing
        if (!user.avatar && picture) {
          user.avatar = picture;
          await user.save();
        }
      }
    } else {
      console.log('✨ Creating NEW Google user:', email);
      user = await User.create({
        name,
        email,
        avatar: picture,
        authProvider: "google",
        isVerified: true, // Auto-verified
        role: "user"
      });
      console.log('✅ New user created with role:', user.role);
    }

    console.log(`🔐 Google Login for ${email} | Role: ${user.role}`);

    const jwtToken = generateToken(user);

    res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        authProvider: user.authProvider
      }
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Google authentication failed", error: error.message });
  }
};

export { register };
