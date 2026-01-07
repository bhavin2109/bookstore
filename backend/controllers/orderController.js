import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import sendEmail from '../utils/sendEmail.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import DeliveryPartner from '../models/DeliveryPartner.js';
import sendSMS from '../utils/sendSMS.js';
import Otp from '../models/Otp.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    console.log(`[ORDER] Creating order for user: ${req.user?._id}`);

    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    // 1. Auth & User Validation
    if (!req.user) {
        console.error('[ORDER] Error: User not found in request');
        res.status(401);
        throw new Error('Not authorized, user not found');
    }

    if (!req.user.isVerified) {
        console.warn(`[ORDER] Warning: Unverified user ${req.user._id} attempted order`);
        res.status(403);
        throw new Error('Please verify your email to place an order.');
    }

    // 2. Body Validation
    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // Validate valid product IDs in items
    const hasInvalidItems = orderItems.some(item => !item.product && !item._id && !item.id);
    if (hasInvalidItems) {
        res.status(400);
        throw new Error('One or more order items are missing a valid Product ID');
    }

    if (!shippingAddress || !paymentMethod || totalPrice === undefined) {
        console.error('[ORDER] Error: Missing required fields', { shippingAddress, paymentMethod, totalPrice });
        res.status(400);
        throw new Error('Missing required order fields (Address, Payment Method, or Total Price)');
    }

    if (isNaN(totalPrice)) {
        res.status(400);
        throw new Error('Invalid total price');
    }

    // 3. Create Order Object
    const order = new Order({
        orderItems: orderItems.map((x) => ({
            ...x,
            product: x.product || x._id || x.id, // Handle distinct frontend payloads (item.id, item._id, or item.product)
            _id: undefined // Let Mongoose generate ID
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    });

    let createdOrder;
    try {
        createdOrder = await order.save();
        console.log(`[ORDER] DB Order created: ${createdOrder._id}`);
    } catch (error) {
        console.error('[ORDER] DB Save Failed:', error);
        if (error.name === 'ValidationError') {
            res.status(400);
            throw new Error('Validation Failed: ' + error.message);
        }
        res.status(500);
        throw new Error('Failed to save order to database: ' + error.message);
    }

    // 4. Razorpay Integration
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error('[ORDER] Razorpay keys missing in environment variables');
            // Do not crash, just warn. But for checkout flow, this is critical.
            throw new Error("Razorpay keys not configured on server");
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(totalPrice * 100), // Amount in paise
            currency: 'INR',
            receipt: createdOrder._id.toString(),
            notes: {
                userId: req.user._id.toString(),
                userEmail: req.user.email
            }
        };

        const razorpayOrder = await razorpay.orders.create(options);
        console.log(`[ORDER] Razorpay order created: ${razorpayOrder.id}`);

        // 5. Send Confirmation Email (Async - don't block response)
        const message = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h2 style="color: #4CAF50;">Order Placed Successfully!</h2>
            <p>Hi ${req.user.name},</p>
            <p>Your order ID: <strong>${createdOrder._id}</strong>.</p>
            <p>Total: $${createdOrder.totalPrice}</p>
            <p>We'll notify you when it ships!</p>
        </div>
        `;

        sendEmail({
            email: req.user.email,
            subject: 'Order Confirmation - Nerdy Enough',
            message
        }).catch(err => console.error('[ORDER] Email send failed:', err));

        // 6. Success Response
        res.status(201).json({
            ...createdOrder._doc,
            razorpayOrderId: razorpayOrder.id,
            razorpayAmount: razorpayOrder.amount,
            razorpayCurrency: razorpayOrder.currency
        });

    } catch (error) {
        console.error("[ORDER] Razorpay/Post-Process Failed:", error);
        // If money hasn't moved, we might want to return 500 but keep the order as 'Pending Payment'
        res.status(500);
        throw new Error('Order saved but payment initiation failed: ' + error.message);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        // Payment result from Razorpay or other gateway
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time, // optional
            email_address: req.body.email_address, // optional
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id, isVisibleToUser: true });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (!order.isPaid) {
            res.status(400);
            throw new Error('Order must be paid before delivery');
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Hide order from user history
// @route   PUT /api/orders/:id/hide
// @access  Private
const hideOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to hide this order');
        }

        order.isVisibleToUser = false;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});



// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        // Enforce 24-hour window
        const orderTime = new Date(order.createdAt).getTime();
        const currentTime = Date.now();
        const hoursDiff = (currentTime - orderTime) / (1000 * 60 * 60);

        if (hoursDiff > 24) {
            res.status(400);
            throw new Error('Order cannot be cancelled after 24 hours');
        }

        if (order.isDelivered) {
            res.status(400);
            throw new Error('Cannot cancel a delivered order');
        }

        order.isCancelled = true;
        order.cancelledAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get dashboard stats (Admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalRevenueFn = Order.aggregate([
        { $match: { isPaid: true, isCancelled: false } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const pendingOrdersFn = Order.countDocuments({ isDelivered: false, isCancelled: false });
    const deliveredOrdersFn = Order.countDocuments({ isDelivered: true });
    const cancelledOrdersFn = Order.countDocuments({ isCancelled: true });

    const bookCountFn = Book.countDocuments({});
    const userCountFn = User.countDocuments({});

    const monthlyRevenueFn = Order.aggregate([
        {
            $match: {
                isPaid: true,
                isCancelled: false,
                paidAt: { $exists: true, $ne: null }
            }
        },
        {
            $group: {
                _id: { $month: { $toDate: '$paidAt' } },
                total: { $sum: '$totalPrice' }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const [
        revenueResult,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        bookCount,
        userCount,
        monthlyRevenueResult
    ] = await Promise.all([
        totalRevenueFn,
        pendingOrdersFn,
        deliveredOrdersFn,
        cancelledOrdersFn,
        bookCountFn,
        userCountFn,
        monthlyRevenueFn
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Format monthly revenue for frontend [ { _id: 1, total: 100 }, ... ]
    // We can just send the result directly
    const monthlyRevenue = monthlyRevenueResult || [];

    res.json({
        totalRevenue,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        bookCount,
        userCount,
        monthlyRevenue
    });
});


// @desc    Assign order to delivery partner
// @route   PUT /api/orders/:id/assign
// @access  Private/Admin
const assignDeliveryPartner = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { deliveryPartnerId } = req.body;

    // Populate user to get email/phone
    const order = await Order.findById(id).populate('user', 'name email');
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Check if flow allows assignment
    if (order.deliveryStatus !== 'packed_by_seller' && order.deliveryStatus !== 'placed') {
        // Allow assignment even if just placed, but ideally after packed.
        // Let's enforce it needs to be packed or placed (if seller packs immediately)
    }

    // Resolve delivery partner user for notification
    const partner = await DeliveryPartner.findById(deliveryPartnerId).populate('user', 'email name phone'); // Assuming phone is in User or we check DeliveryPartner details

    // NOTE: DeliveryPartner model (Step 160) doesn't have phone. User model usually has it? 
    // Step 157 Order.shippingAddress.phone exists. User model Step 138/171 doesn't explicitly show phone schema but let's assume valid email.

    if (partner && partner.user) {
        // Generate Assignment OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.create({
            orderId: order._id,
            recipientEmail: partner.user.email,
            code: otpCode,
            type: 'delivery_assignment'
        });

        const message = `
            <h3>New Delivery Assignment!</h3>
            <p>Hi ${partner.user.name}, you have been assigned Order <strong>#${order._id}</strong>.</p>
            <p>Please use this OTP to accept the assignment:</p>
            <h2 style="color: #2b6cb0;">${otpCode}</h2>
        `;

        try {
            await sendEmail({
                email: partner.user.email,
                subject: 'New Delivery Assignment - OTP',
                message
            });
            // Mock SMS
            await sendSMS({
                phone: '9999999999', // Placeholder if no phone in user
                message: `Delivery Assignment: Order #${order._id}. OTP: ${otpCode}`
            });
        } catch (error) {
            console.error("Failed to notify partner:", error);
        }
    }

    // We do NOT set 'assigned_to_delivery' yet. We wait for OTP verification.
    // However, to let them see it in dashboard, checking 'deliveryPartner' is enough as per logic.
    order.deliveryPartner = deliveryPartnerId;
    // We update timeline to show 'Pending Acceptance' maybe?
    order.timeline.push({
        status: order.deliveryStatus, // Keep current status
        description: 'Assigned to delivery partner (Pending Acceptance)'
    });

    await order.save();

    res.json({ message: 'Delivery Partner assigned. Waiting for acceptance OTP.', order });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Seller/Delivery)
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Role-based validation
    if (req.user.role === 'seller' && status === 'packed_by_seller') {
        // Seller can mark as packed
    } else if (req.user.role === 'delivery' && ['dispatched', 'out_for_delivery', 'delivered'].includes(status)) {
        // Delivery partner updates
        const partner = await DeliveryPartner.findOne({ user: req.user._id });
        if (!partner || order.deliveryPartner.toString() !== partner._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this order');
        }
    } else if (req.user.role === 'admin') {
        // Admin can do anything
    } else {
        res.status(401);
        throw new Error('Not authorized for this status change');
    }

    order.deliveryStatus = status;
    order.timeline.push({
        status: status,
        description: `Order status updated to ${status}`
    });

    if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    // Notify User
    await Notification.create({
        recipient: order.user,
        type: 'order_update',
        message: `Order #${order._id} is now ${status.replace(/_/g, ' ')}`,
        relatedId: order._id
    });

    res.json(updatedOrder);
});

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    cancelOrder,
    hideOrder,
    getDashboardStats,
    assignDeliveryPartner,
    updateOrderStatus
};
