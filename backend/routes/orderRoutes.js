import express from 'express';
const router = express.Router();
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    cancelOrder,
    hideOrder,
    getDashboardStats
} from '../controllers/orderController.js';
import { protect, adminOnly as admin } from '../middlewares/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/stats').get(protect, admin, getDashboardStats);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/hide').put(protect, hideOrder);

export default router;
