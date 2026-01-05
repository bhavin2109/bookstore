import express from 'express';
const router = express.Router();
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders, // This will likely be replaced by getAllOrders if the intent is to refactor
    updateOrderToDelivered,
    cancelOrder,
    hideOrder,
    getDashboardStats,
    assignDeliveryPartner // Added this controller
} from '../controllers/orderController.js';
import { protect, adminOnly as admin } from '../middlewares/authMiddleware.js'; // Kept 'admin' alias for consistency with existing routes

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/stats').get(protect, admin, getDashboardStats);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/assign').put(protect, admin, assignDeliveryPartner); // Added this route
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/hide').put(protect, hideOrder);

export default router;
