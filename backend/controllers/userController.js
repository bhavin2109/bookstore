import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Seller from "../models/Seller.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
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

export const requestRole = async (req, res) => {
  try {
    const { role, shopDetails, deliveryDetails } = req.body;
    if (!["seller", "delivery"].includes(role)) {
      return res.status(400).json({ message: "Invalid role request" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.roleRequestStatus === "pending") {
      return res.status(400).json({ message: "You already have a pending request" });
    }

    user.roleRequest = role;
    user.roleRequestStatus = "pending";

    if (role === "seller" && shopDetails) {
      user.shopDetails = shopDetails;
    }
    if (role === "delivery" && deliveryDetails) {
      user.deliveryDetails = deliveryDetails;
    }

    await user.save();

    res.status(200).json({ message: "Role request submitted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRoleRequests = async (req, res) => {
  try {
    const users = await User.find({ roleRequestStatus: "pending" }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateRoleRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.roleRequestStatus !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    if (status === "approved") {
      user.role = user.roleRequest; // Upgrade role
      user.roleRequestStatus = "approved";

      // Create specific profile
      if (user.role === "seller") {
        const existingSeller = await Seller.findOne({ user: user._id });
        if (!existingSeller) {
          await Seller.create({
            user: user._id,
            storeName: user.shopDetails?.shopName || `${user.name}'s Store`,
            storeDescription: user.shopDetails?.shopDescription || "",
            slug: (user.shopDetails?.shopName || user.name).toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000)
          });
        }
      } else if (user.role === "delivery") {
        const existingPartner = await DeliveryPartner.findOne({ user: user._id });
        if (!existingPartner) {
          await DeliveryPartner.create({
            user: user._id,
            vehicleType: user.deliveryDetails?.vehicleType || 'Bike',
            vehicleNumber: user.deliveryDetails?.vehicleNumber || 'Unknown'
          });
        }
      }

    } else {
      user.roleRequestStatus = "rejected";
      user.roleRequest = undefined; // Reset request
    }

    await user.save();
    res.status(200).json({ message: `Request ${status}`, user });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      roleRequest: user.roleRequest,
      roleRequestStatus: user.roleRequestStatus,
      avatar: user.avatar,
      authProvider: user.authProvider,
      shopDetails: user.shopDetails,
      deliveryDetails: user.deliveryDetails
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Wishlist Management
export const toggleWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.wishlist.indexOf(bookId);
    if (index === -1) {
      user.wishlist.push(bookId);
      await user.save();
      return res.status(200).json({ message: "Added to wishlist", wishlist: user.wishlist });
    } else {
      user.wishlist.splice(index, 1);
      await user.save();
      return res.status(200).json({ message: "Removed from wishlist", wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Address Management
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAddress = req.body;
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json({ message: "Address added", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await user.save();
    res.status(200).json({ message: "Address removed", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { addressId } = req.params;
    const updatedData = req.body;

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    if (updatedData.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    Object.assign(address, updatedData);
    await user.save();
    res.status(200).json({ message: "Address updated", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success message to prevent email enumeration
    if (!user) {
      return res.status(200).json({ message: "If an account with that email exists, we have sent a reset link." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and save to DB
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire time (10 minutes)
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset url
    // Use FRONTEND_URL from env if available, otherwise assume localhost or infer from headers? 
    // Best to rely on an env var for the frontend URL in production, but for now we can default or use referer.
    // Given the prompt asks to use FRONTEND_URL from env.
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
      });

      res.status(200).json({ message: "If an account with that email exists, we have sent a reset link." });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set new password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // If user wasn't verified, verify them now since they own the email
    if (!user.isVerified) {
      user.isVerified = true;
    }

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { register };
