import DeliveryPartner from "../models/DeliveryPartner.js";
import Order from "../models/Order.js";

// Admin: Get all delivery partners
export const getAllDeliveryPartners = async (req, res) => {
    try {
        const partners = await DeliveryPartner.find().populate('user', 'name email');
        res.json(partners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Get current delivery profile
export const getMyProfile = async (req, res) => {
    try {
        const partner = await DeliveryPartner.findOne({ user: req.user._id });
        if (!partner) return res.status(404).json({ message: "Delivery profile not found" });
        res.json(partner);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Update availability or vehicle
export const updateProfile = async (req, res) => {
    try {
        const partner = await DeliveryPartner.findOne({ user: req.user._id });
        if (!partner) return res.status(404).json({ message: "Delivery profile not found" });

        if (req.body.isAvailable !== undefined) {
            partner.isAvailable = req.body.isAvailable;
        }
        if (req.body.vehicleDetails) {
            partner.vehicleDetails = req.body.vehicleDetails;
        }
        if (req.body.currentLocation) {
            partner.currentLocation = req.body.currentLocation;
        }

        await partner.save();
        res.json(partner);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Get orders assigned to me
export const getMyOrders = async (req, res) => {
    try {
        // Find orders where deliveryPartner is current user
        // Note: We need to make sure we link using user ID or Partner ID.
        // In userController when creating partner, we just create the profile.
        // In Order model, deliveryPartner is ref to 'User' or 'DeliveryPartner'?
        // The implementation plan said "ref User/Seller ... DeliveryPartner (ref)". 
        // Order model update in Step 0 showed `deliveryPartner: { type: Schema.Types.ObjectId, ref: 'User' }` usually?
        // Let's check Order model again to be sure. Assumed ref to User for authentication simplicity.

        const orders = await Order.find({ deliveryPartner: req.user._id })
            .populate('user', 'name email address')
            .populate('items.product', 'title image price')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Update Order Delivery Status
export const updateOrderDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'out_for_delivery', 'delivered' (requires OTP)

        const order = await Order.findOne({ _id: id, deliveryPartner: req.user._id });
        if (!order) return res.status(404).json({ message: "Order not found or not assigned to you" });

        if (status === 'out_for_delivery') {
            order.deliveryStatus = 'out_for_delivery';
            // Generate OTP
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            order.deliveryOtp = otp;
            await order.save();

            // TODO: Send OTP to user email/sms (Mock for now)
            console.log(`[OTP] Order ${id} OTP: ${otp}`);

            res.json({ message: "Order marked Out for Delivery", order });
        } else {
            res.status(400).json({ message: "Invalid status update via this endpoint" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Complete Delivery (Verify OTP)
export const completeDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const { otp } = req.body;

        const order = await Order.findOne({ _id: id, deliveryPartner: req.user._id });
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.deliveryStatus !== 'out_for_delivery') {
            return res.status(400).json({ message: "Order must be Out for Delivery" });
        }

        if (order.deliveryOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        order.deliveryStatus = 'delivered';
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.deliveryOtp = null; // Clear OTP
        await order.save();

        res.json({ message: "Delivery verified and completed", order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
