import express from 'express';
import sendOtpMail from '../middlewares/sendOtpMail.js';
import { register, verifyOtp, deleteUser, login, resendOtp, googleAuthLogin, requestRole, getRoleRequests, updateRoleRequest, getUserProfile, toggleWishlist, getWishlist, addAddress, removeAddress, updateAddress, getUserAddresses, forgotPassword, resetPassword } from '../controllers/userController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register, sendOtpMail, (req, res) => {
    console.log('✅ Registration flow completed successfully');
    res.status(200).json({
        message: 'Registration successful, OTP sent to email',
        token: req.authData?.token,
        user: req.authData?.user
    });
});

router.post('/resend-otp', resendOtp, sendOtpMail, (req, res) => {
    res.status(200).json({ message: 'OTP resent successfully' });
});

router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/login', login);
router.post('/google', googleAuthLogin);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Role Management Routes
router.post('/request-role', protect, requestRole);
router.get('/profile', protect, getUserProfile);
router.get('/admin/role-requests', protect, adminOnly, getRoleRequests);
router.put('/admin/role-requests/:id', protect, adminOnly, updateRoleRequest);

// Wishlist Management
router.post('/wishlist', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);

// Address Management
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, removeAddress);
router.put('/address/:addressId', protect, updateAddress);
router.get('/address', protect, getUserAddresses);

// DELETE route for testing - remove in production
router.delete('/delete-user', deleteUser);

// Error handling middleware (must be last)
router.use((err, req, res, next) => {
    console.error('❌ Route error:', err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

export default router;