
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },
        recipientEmail: {
            type: String,
            required: true
        },
        recipientPhone: {
            type: String
        },
        code: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['delivery_assignment', 'delivery_confirmation'],
            required: true
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

// Auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
