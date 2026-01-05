import express from 'express';
import {
    getMyProfile,
    updateProfile,
    getMyOrders,
    updateOrderDeliveryStatus,
    completeDelivery,
    getAllDeliveryPartners
} from '../controllers/deliveryController.js';
import { protect, deliveryOnly, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/admin/partners', protect, adminOnly, getAllDeliveryPartners);
router.get('/me', protect, deliveryOnly, getMyProfile);
router.put('/me', protect, deliveryOnly, updateProfile);
router.get('/orders', protect, deliveryOnly, getMyOrders);
router.put('/orders/:id/status', protect, deliveryOnly, updateOrderDeliveryStatus);
router.post('/orders/:id/verify', protect, deliveryOnly, completeDelivery);

export default router;
