import DeliveryPartner from "../models/DeliveryPartner.js";
import Order from "../models/Order.js";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendEmail.js";
import sendSMS from "../utils/sendSMS.js";
import Notification from "../models/Notification.js";

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
        const partner = await DeliveryPartner.findOne({ user: req.user._id });
        if (!partner) return res.status(404).json({ message: "Delivery profile not found" });

        const orders = await Order.find({ deliveryPartner: partner._id })
            .populate('user', 'name email address')
            .populate('orderItems.product', 'title image price')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error("Error in getMyOrders:", err);
        res.status(500).json({ message: err.message });
    }
}

// Accept Delivery Assignment (Verify OTP)
export const acceptDeliveryAssignment = async (req, res) => {
    try {
        const { id } = req.params; // Order ID
        const { otp } = req.body;

        const partner = await DeliveryPartner.findOne({ user: req.user._id });
        if (!partner) return res.status(404).json({ message: "Delivery profile not found" });

        const order = await Order.findOne({ _id: id, deliveryPartner: partner._id }).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: "Order not found or not assigned to you" });

        // Verify OTP
        const otpRecord = await Otp.findOne({
            orderId: id,
            code: otp,
            type: 'delivery_assignment',
            isVerified: false
        });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        if (new Date() > otpRecord.expiresAt) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Mark OTP as used
        otpRecord.isVerified = true;
        await otpRecord.save();

        // Update Order Status
        order.deliveryStatus = 'assigned_to_delivery';
        order.timeline.push({
            status: 'assigned_to_delivery',
            description: 'Order accepted by delivery partner'
        });
        await order.save();

        // Notify Customer (Now that partner accepted)
        if (order.user) {
            const message = `
                <h3>Order Update!</h3>
                <p>Your order <strong>#${order._id}</strong> has been assigned to ${partner.user.name || 'a delivery agent'}.</p>
                <p>It will be picked up soon.</p>
            `;
            try {
                await sendEmail({
                    email: order.user.email,
                    subject: 'Order Update - Delivery Agent Assigned',
                    message
                });
                await sendSMS({
                    phone: order.shippingAddress.phone || '0000000000',
                    message: `Order #${order._id.toString().slice(-6)}: Agent assigned.`
                });
            } catch (e) { console.error("Notify error", e); }

            req.io.to(order.user._id.toString()).emit('order_update', {
                orderId: order._id,
                status: 'assigned_to_delivery',
                timeline: order.timeline
            });
        }

        res.json({ message: "Assignment accepted successfully", order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Update Order Delivery Status (Out for Delivery -> Send OTP)
export const updateOrderDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'out_for_delivery'

        const partner = await DeliveryPartner.findOne({ user: req.user._id });
        if (!partner) return res.status(404).json({ message: "Delivery profile not found" });

        const order = await Order.findOne({ _id: id, deliveryPartner: partner._id }).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: "Order not found or not assigned to you" });

        if (status === 'out_for_delivery') {
            order.deliveryStatus = 'out_for_delivery';
            order.timeline.push({ status: 'out_for_delivery', description: 'Out for delivery' });
            await order.save(); // deliveryOtp is NOT saved on Order anymore

            // Generate OTP
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            await Otp.create({
                orderId: order._id,
                recipientEmail: order.user.email,
                code: otpCode,
                type: 'delivery_confirmation'
            });

            // Send OTP via Email
            const message = `
                <h1>Your Order is Out for Delivery! 🚚</h1>
                <p>Hi ${order.user.name},</p>
                <p>Your order <strong>#${order._id}</strong> is out for delivery.</p>
                <p>Please share this OTP with the delivery partner to receive your package:</p>
                <h2 style="color: #2F855A; letter-spacing: 5px;">${otpCode}</h2>
            `;

            try {
                await sendEmail({
                    email: order.user.email,
                    subject: 'Delivery OTP - Nerdy Enough',
                    message
                });
                // Send Mock SMS
                await sendSMS({
                    phone: order.shippingAddress.phone || '0000000000',
                    message: `Order #${order._id.toString().slice(-6)} out for delivery. OTP: ${otpCode}`
                });
            } catch (error) {
                console.error("Failed to send Notification:", error);
            }

            // Real-time update
            req.io.to(order.user._id.toString()).emit('order_update', {
                orderId: order._id,
                status: 'out_for_delivery',
                timeline: order.timeline
            });

            console.log(`[OTP] Order ${id} Delivery OTP: ${otpCode}`);
            res.json({ message: "Order marked Out for Delivery. OTP sent to customer.", order });
        } else {
            res.status(400).json({ message: "Invalid status update via this endpoint. Use completeDelivery for final status." });
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

        const partner = await DeliveryPartner.findOne({ user: req.user._id });
        if (!partner) return res.status(404).json({ message: "Delivery profile not found" });

        const order = await Order.findOne({ _id: id, deliveryPartner: partner._id }).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.deliveryStatus !== 'out_for_delivery') {
            return res.status(400).json({ message: "Order must be Out for Delivery first" });
        }

        // Verify OTP
        const otpRecord = await Otp.findOne({
            orderId: id,
            code: otp,
            type: 'delivery_confirmation',
            isVerified: false
        });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Mark OTP as used
        otpRecord.isVerified = true;
        await otpRecord.save();

        order.deliveryStatus = 'delivered';
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.timeline.push({ status: 'delivered', description: 'Delivered to customer' });
        // order.deliveryOtp = null; // Removed generic field usage
        await order.save();

        res.json({ message: "Delivery verified and completed", order });

        // Real-time update
        req.io.to(order.user._id.toString()).emit('order_update', {
            orderId: order._id,
            status: 'delivered',
            isDelivered: true,
            timeline: order.timeline
        });

        // Notify user of completion
        await Notification.create({
            recipient: order.user._id,
            type: 'order_update',
            message: `Order #${order._id} Delivered`,
            relatedId: order._id
        });

        const message = `
            <h1>Order Delivered! 🎉</h1>
            <p>Hi ${order.user.name},</p>
            <p>Your order <strong>#${order._id}</strong> has been successfully delivered.</p>
            <p>Thank you for shopping with Nerdy Enough!</p>
        `;

        try {
            await sendEmail({
                email: order.user.email,
                subject: 'Order Delivered - Nerdy Enough',
                message
            });
            await sendSMS({
                phone: order.shippingAddress.phone || '0000000000',
                message: `Order #${order._id.toString().slice(-6)} has been delivered. Thank you!`
            });
        } catch (error) {
            console.error("Failed to notify user of delivery:", error);
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
// Resend Delivery OTP
export const resendDeliveryOtp = async (req, res) => {
    try {
        const { id } = req.params;

        const partner = await DeliveryPartner.findOne({ user: req.user._id });
        if (!partner) return res.status(404).json({ message: "Delivery profile not found" });

        const order = await Order.findOne({ _id: id, deliveryPartner: partner._id }).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.deliveryStatus !== 'out_for_delivery') {
            return res.status(400).json({ message: "Order must be Out for Delivery to resend OTP" });
        }

        // Generate New OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Invalidate old OTPs for this order/type
        await Otp.deleteMany({ orderId: id, type: 'delivery_confirmation' });

        await Otp.create({
            orderId: order._id,
            recipientEmail: order.user.email,
            code: otpCode,
            type: 'delivery_confirmation'
        });

        // Send OTP via Email
        const message = `
            <h1>Delivery OTP Resent 🚚</h1>
            <p>Hi ${order.user.name},</p>
            <p>Here is your new OTP for order delivery verification:</p>
            <h2 style="color: #2F855A; letter-spacing: 5px;">${otpCode}</h2>
            <p>Please share this with the delivery partner.</p>
        `;

        try {
            await sendEmail({
                email: order.user.email,
                subject: 'Resent Delivery OTP - Nerdy Enough',
                message
            });
            await sendSMS({
                phone: order.shippingAddress.phone || '0000000000',
                message: `Resent OTP: Order #${order._id.toString().slice(-6)} delivery code is ${otpCode}`
            });
        } catch (error) {
            console.error("Failed to resend Notification:", error);
        }

        console.log(`[OTP] Resent Order ${id} Delivery OTP: ${otpCode}`);
        res.json({ message: "OTP has been resent to the customer" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
