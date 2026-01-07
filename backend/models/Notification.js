import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        type: {
            type: String,
            enum: ["order_update", "delivery_assigned", "new_message", "system"],
            required: true
        },
        message: { type: String, required: true },
        relatedId: { type: mongoose.Schema.Types.ObjectId }, // e.g., Order ID or Chat ID
        isRead: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
