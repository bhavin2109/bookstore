import Seller from "../models/Seller.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";

// Get current seller profile
export const getMe = async (req, res) => {
    try {
        const seller = await Seller.findOne({ user: req.user._id });
        if (!seller) {
            return res.status(404).json({ message: "Seller profile not found" });
        }
        res.json(seller);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update store
export const updateStore = async (req, res) => {
    try {
        const seller = await Seller.findOne({ user: req.user._id });
        if (!seller) {
            return res.status(404).json({ message: "Seller profile not found" });
        }

        // prevent updating user field
        delete req.body.user;

        // Update fields
        Object.assign(seller, req.body);
        await seller.save();
        res.json(seller);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get store public (by slug)
export const getStoreBySlug = async (req, res) => {
    try {
        const seller = await Seller.findOne({ slug: req.params.slug });
        if (!seller) {
            return res.status(404).json({ message: "Store not found" });
        }

        const books = await Book.find({ seller: seller._id });
        res.json({ seller, books });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get my products
export const getMyProducts = async (req, res) => {
    try {
        const seller = await Seller.findOne({ user: req.user._id });
        if (!seller) {
            return res.status(404).json({ message: "Seller profile not found" });
        }
        const books = await Book.find({ seller: seller._id });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get seller orders
export const getSellerOrders = async (req, res) => {
    try {
        const seller = await Seller.findOne({ user: req.user._id });
        if (!seller) {
            return res.status(404).json({ message: "Seller profile not found" });
        }
        const orders = await Order.find({ seller: seller._id }).populate("user", "name email").sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
