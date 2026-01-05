import express from 'express';
import { getMe, updateStore, getStoreBySlug, getMyProducts } from '../controllers/sellerController.js';
import { protect, sellerOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, sellerOnly, getMe);
router.put('/me', protect, sellerOnly, updateStore);
router.get('/my-products', protect, sellerOnly, getMyProducts);
router.get('/:slug', getStoreBySlug);

export default router;
