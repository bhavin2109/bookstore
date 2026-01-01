import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import sendEmail from '../utils/sendEmail.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (!req.user.isVerified) {
        res.status(403);
        throw new Error('Please verify your email to place an order.');
    }

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });


        const createdOrder = await order.save(); // Save to DB

        // Validate Total Price
        if (!totalPrice || isNaN(totalPrice)) {
            res.status(400);
            throw new Error('Invalid total price calculated');
        }

        // Create Razorpay Order
        const options = {
            amount: Math.round(totalPrice * 100), // Amount in paise
            currency: 'INR',
            receipt: createdOrder._id.toString(),
        };

        try {
            if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
                throw new Error("Razorpay keys not configured on server");
            }

            // Initialize Razorpay lazily to avoid startup crashes if env vars are missing
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });

            const razorpayOrder = await razorpay.orders.create(options);

            // Send Email
            const message = `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                <h2 style="color: #4CAF50;">Thank You for Your Order!</h2>
                <p>Hi,</p>
                <p>Your order with ID <strong>${createdOrder._id}</strong> has been placed successfully.</p>
                <h3>Order Details:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background-color: #f2f2f2; text-align: left;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${createdOrder.orderItems.map(item => `
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${item.qty}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">$${item.price}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <h3>Total Price: $${createdOrder.totalPrice}</h3>
                <p>We will notify you once your order is shipped.</p>
                <p>Thanks,<br>Nerdy Enough Team</p>
            </div>
            `;

            try {
                await sendEmail({
                    email: req.user.email,
                    subject: 'Order Confirmation - Nerdy Enough',
                    message
                });
            } catch (error) {
                console.error(error);
            }

            res.status(201).json({
                ...createdOrder._doc,
                razorpayOrderId: razorpayOrder.id,
                razorpayAmount: razorpayOrder.amount,
                razorpayCurrency: razorpayOrder.currency
            });

        } catch (error) {
            console.error("Razorpay Order Creation Failed:", error);
            // If Razorpay fails, we technically still have a DB order. 
            // Should we delete it? Or just return error?
            // For now, let's keep the order but inform frontend. 
            // Or better, failed payment flow.
            res.status(500);
            throw new Error('Failed to initiate payment with Razorpay: ' + error.message);
        }
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

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    cancelOrder,
    hideOrder,
    getDashboardStats
};
