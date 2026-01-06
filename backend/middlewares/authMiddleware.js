import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        next();
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
}

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized, admin only' });
    }
};


export const sellerOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized, seller only' });
    }
}

export const deliveryOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'delivery' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized, delivery partner only' });
    }
}