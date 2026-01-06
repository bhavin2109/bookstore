import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () { return this.authProvider === 'local'; },
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: {
      type: String,
      enum: ["user", "admin", "seller", "delivery"],
      default: "user",
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    avatar: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    roleRequest: {
      type: String,
      enum: ["seller", "delivery"],
    },
    roleRequestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: null,
    },
    shopDetails: {
      shopName: String,
      shopDescription: String,
      shopAddress: String,
    },
    deliveryDetails: {
      vehicleType: String,
      vehicleNumber: String,
      licenseNumber: String,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    addresses: [
      {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
