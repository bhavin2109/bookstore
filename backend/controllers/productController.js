import Products from '../models/Products.js';
import Users from '../models/User.js';
import mongoose from 'mongoose';

export const createProduct = async (req, res) => {
    try {
        // Enforce strict fields from the request body
        const { title, author, description, price, genre, image } = req.body;
        
        const product = await Products.create({
            title,
            author,
            description,
            price,
            genre, 
            image,
            createdBy: req.user._id
        });
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find().sort({ createdAt: -1 });

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
             return res.status(404).json({ message: 'Product not found (Invalid ID)' });
        }

        const product = await Products.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product); // Send product directly or wrapped, frontend expects object
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Products.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Products.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

export const productCount = async (req, res) => {
    try {
        const count = await Products.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};  

export const userCount = async (req, res) => {
    try {
        const count = await Users.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};  