import express from 'express';
import { protect, sellerOnly as seller } from '../middlewares/authMiddleware.js';
import { getMe, updateStore, getStoreBySlug, getMyProducts, getSellerOrders } from '../controllers/sellerController.js';

const router = express.Router();

router.get('/me', protect, seller, getMe);
router.put('/me', protect, seller, updateStore);
router.get('/store/:slug', getStoreBySlug);
router.get('/products', protect, seller, getMyProducts);
router.get('/orders', protect, seller, getSellerOrders);

export default router;
